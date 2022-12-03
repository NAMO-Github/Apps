// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./WrappedERC721.sol";

contract LoanNftV2 is Ownable, IERC721Receiver {
    // variables and mappings
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    Counters.Counter public _marketIds;

    address public namoAddress;

    uint256 public taxPercentage;

    address public signer;

    address public erc721WrappedAddress;

    IERC721 public NFT721;

    bytes32 public constant
        HIRE_NFT_WITH_SIG_TYPEHASH = keccak256("HireNFT(address proxyAddress,uint256 nonce,uint256 deadline)");

    mapping(uint256 => Package) public _itemToPackages;

    mapping(address => mapping(uint256 => uint256)) public _nftToMarketId;

    mapping(address => mapping(uint256 => uint256)) public nftToWrappedNftId;

    mapping(uint256 => address) public _packageToLender;

    mapping(uint256 => uint256) public _packageToRental;

    mapping(address => uint256) public _hireNftSigNonces;

    mapping(uint256 => uint256) public _lastHireItem;

    mapping(uint256 => address) public _proxyOwner;

    mapping(uint256 => address) public _marketToRenter;

    uint256 public gasUnitToCharge = 180000;
    // structs and events
    struct Package {
        uint256[] duration;
        uint256[] price;
        address paymentToken;
        address tokenAddress;
        uint256 tokenId;
        uint256 marketId;
    }

    event ListItem(
        address lender,
        address tokenAddress,
        uint256 itemId,
        uint256 marketItem,
        uint256[] duration,
        uint256[] price,
        address paymentToken,
        uint256 wrappedTokenId
    );
    event EditItem(
        address lender,
        address tokenAddress,
        uint256 itemId,
        uint256 marketItem,
        uint256[] duration,
        uint256[] price,
        address paymentToken
    );
    event DelistItem(
        address lender,
        address tokenAddress,
        uint256 itemId,
        uint256 marketItem
    );
    event RentItem(
        address lender,
        address renter,
        address tokenAddress,
        uint256 itemId,
        uint256 marketItem,
        uint256 packageIndex,
        address paymentToken,
        uint256 gasPrice
    );
    event Return(address lender, address proxyAddress, address tokenAddress, uint256 tokenId, uint marketItem);

    // functions and constructor
    constructor(
        address _namoAddress,
        uint256 _taxPercentage,
        address _signer,
        address _erc721WrappedAddress
    ) {
        namoAddress = _namoAddress;
        taxPercentage = _taxPercentage;
        signer = _signer;
        erc721WrappedAddress = _erc721WrappedAddress;
    }

    function setERC721WrappedAddress(address wrappedAddress) external onlyOwner {
        erc721WrappedAddress = wrappedAddress;
    }

    function setGasToCharge(uint256 _gasUnitToCharge) external onlyOwner {
        gasUnitToCharge = _gasUnitToCharge;
    }

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function getListedItem() public view returns (Package[] memory) {
        uint256 currentMarketId = _marketIds.current();
        uint256 amount = 0;
        uint256 count = 0;
        for (uint256 i = 0; i <= currentMarketId; i++) {
            if (_itemToPackages[i].tokenId != 0) {
                amount++;
            }
        }
        Package[] memory listedItem = new Package[](amount);
        for (uint256 i = 0; i <= currentMarketId; i++) {
            if (_itemToPackages[i].tokenId != 0) {
                listedItem[count] = _itemToPackages[i];
                count++;
            }
        }
        return listedItem;
    }

    function listItem(
        address _nftAddress,
        uint256 _item,
        uint256[] calldata _durations,
        uint256[] calldata _prices,
        address _paymentToken
    ) public {
        require(
            _durations.length > 0
            && _durations.length == _prices.length,
            "[LOAN NFT]: input array must be the same length"
        );
        _marketIds.increment();
        uint256 current = _marketIds.current();
        for(uint256 i = 0; i < _durations.length; i++) {
            require(
                _durations[i] > 0 && _prices[i] > 0,
                "[LOAN NFT]: invalid input data"
            );

        }
        require(_paymentToken != address(0), "[LOAN NFT]: invalid payment token");
        (bool success, ) = _nftAddress.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), _item));
        require(success, "[LOAN NFT]: ERC721: caller is not token owner nor approved");
        _packageToLender[current] = _msgSender();
        _itemToPackages[current] = Package(
            {
                duration: _durations,
                price: _prices,
                paymentToken: _paymentToken,
                marketId: current,
                tokenAddress: _nftAddress,
                tokenId: _item
            }
        );
        _nftToMarketId[_nftAddress][_item] = current;
        if (nftToWrappedNftId[_nftAddress][_item] == 0) {
            _mintWrapNft(_nftAddress, _item);
        }
        uint256 tokenId = nftToWrappedNftId[_nftAddress][_item];
        emit ListItem(msg.sender, _nftAddress, _item, current, _durations, _prices, _paymentToken, tokenId);

    }

    function editItem(
        uint256 _marketId,
        uint256[] calldata _durations,
        uint256[] calldata _prices,
        address _paymentToken
    ) public {
        require(_proxyOwner[_marketId] == address(0), '[LOAN NFT] cannot edit while the item is renting');
        require(
            _packageToLender[_marketId] == msg.sender,
            "[LOAN NFT]: invalid item lister"
        );
        Package storage package = _itemToPackages[_marketId];
        for(uint256 i = 0; i < _durations.length; i++) {
            require(
                _durations[i] > 0 && _prices[i] > 0,
                "[LOAN NFT]: invalid input data"
            );
        }
        package.duration = _durations;
        package.price = _prices;
        package.paymentToken = _paymentToken;
        emit EditItem(msg.sender, package.tokenAddress, package.tokenId, _marketId, _durations, _prices, _paymentToken);
    }

    function delistItem(uint256 _marketId) public {
        require(
            _packageToLender[_marketId] == msg.sender,
            "[LOAN NFT]: must be owner to delist"
        );
        address nftAddress = _itemToPackages[_marketId].tokenAddress;
        uint256 nftId = _itemToPackages[_marketId].tokenId;
        delete _packageToLender[_marketId];
        delete _nftToMarketId[nftAddress][_itemToPackages[_marketId].tokenId];
        delete _itemToPackages[_marketId];
        (bool success, ) = nftAddress.call(abi.encodeWithSelector(0x23b872dd, address(this), msg.sender, nftId));
        require(success, "[LOAN NFT]: ERC721: caller is not token owner nor approved");
        emit DelistItem(msg.sender, nftAddress, nftId, _marketId);
    }

    function delistItemByNft(address _nftAddress, uint256 _item) public {
        uint marketId = _nftToMarketId[_nftAddress][_item];
        delistItem(marketId);
    }

    function hireItemWithSig(
        address _proxyAddress,
        uint256 _marketId,
        uint256 _packageIndex,
        uint256 _deadline,
        bytes calldata _signature
    ) public payable {
        Package memory package = _itemToPackages[_marketId];
        address recoverAddress = _recoverSignature(_proxyAddress, msg.sender, _deadline, _signature);
        require(recoverAddress == signer, "[LOAN NFT]: Invalid signature");
            // handle transfer NFT
        require(msg.value >= gasUnitToCharge * tx.gasprice, "[LOAN NFT]: gas price for the return is not enough");
        _transferNftAndRental(
            package,
            taxPercentage * package.price[_packageIndex] / 100,
            _packageIndex,
            _proxyAddress,
            _marketId
        );
        payable(_proxyAddress).transfer(msg.value);
        _lastHireItem[_marketId] = block.timestamp + package.duration[_packageIndex];
        _hireNftSigNonces[msg.sender]++;
        _proxyOwner[_marketId] = _proxyAddress;
        _marketToRenter[_marketId] = msg.sender;
        _updateWrappedNft(package.tokenAddress, package.tokenId);
        _transferWrappedNft(address(this), msg.sender, nftToWrappedNftId[package.tokenAddress][package.tokenId]);
        emit RentItem(
            _packageToLender[_marketId],
            msg.sender,
            package.tokenAddress,
            package.tokenId,
            _marketId,
            _packageIndex,
            package.paymentToken,
            tx.gasprice
        );
    }

    function _recoverSignature(
        address _proxy,
        address _renter,
        uint256 _deadline,
        bytes memory _signature
    ) internal returns (address) {
        require(
            _deadline == 0 || _deadline >= block.timestamp,
            "[LOAN NFT]: Signature expired"
        );

        bytes32 domainSeparator = _calculateDomainSeparator();
        bytes32 hashStruct = _calculateHashStruct(_proxy, _renter, _deadline);
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", domainSeparator, hashStruct)
        );
        return digest.recover(_signature);
    }

    function _transferNftAndRental(
        Package memory package,
        uint256 tax,
        uint256 _packageIndex,
        address _proxyAddress,
        uint256 _marketId
    ) internal {
        bool success;
        (success, ) = package.paymentToken.call(abi.encodeWithSelector(0x23b872dd, msg.sender, namoAddress, tax));
        require(success, "[LOAN NFT]: ERC20: transfer token: caller is not token owner nor approved");
        (success, ) = package.paymentToken.call(
            abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), package.price[_packageIndex] - tax)
        );
        require(success, "[LOAN NFT]: ERC20: transfer token: caller is not token owner nor approved");
        (success, ) = package.tokenAddress.call(
            abi.encodeWithSelector(0x23b872dd, address(this), _proxyAddress, package.tokenId)
        );
        require(success, "[LOAN NFT]: ERC721: transfer nft: caller is not token owner nor approved");
        _packageToRental[_marketId] = package.price[_packageIndex] - tax;

    }

    function returnItem(uint256 _marketId, string memory delistTokenUri) public {
        require(
            block.timestamp >= _lastHireItem[_marketId],
            "[LOAN NFT]: Nft in hire progress"
        );

        require(
            _proxyOwner[_marketId] == msg.sender,
            "[LOAN NFT]: Must be the proxy to call"
        );
        bool success;
        bytes memory message;
//        bytes4 selector = bytes4(keccak256("transfer(address,uint256)")); == 0xa9059cbb
        address proxyAddress = _proxyOwner[_marketId];
        uint256 rental = _packageToRental[_marketId];
        delete _proxyOwner[_marketId];
        delete _lastHireItem[_marketId];
        delete _packageToRental[_marketId];
        (success, message) = _itemToPackages[_marketId].paymentToken.call(
            abi.encodeWithSelector(0xa9059cbb, _packageToLender[_marketId], rental)
        );
        require(success, string(message));
        (success, ) = _itemToPackages[_marketId].tokenAddress.call(
            abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), _itemToPackages[_marketId].tokenId)
        );
        require(success, "[LOAN NFT]: ERC721: caller is not token owner nor approved");
        _transferWrappedNft(
            _marketToRenter[_marketId],
            address(this),
            nftToWrappedNftId[_itemToPackages[_marketId].tokenAddress][_itemToPackages[_marketId].tokenId]
        );
        _removeWrappedNftUri(_itemToPackages[_marketId].tokenAddress, _itemToPackages[_marketId].tokenId, delistTokenUri);
        emit Return(
            _packageToLender[_marketId],
            proxyAddress,
            _itemToPackages[_marketId].tokenAddress,
            _itemToPackages[_marketId].tokenId,
            _marketId
        );
    }

    function returnItemByNft(address _nftAddress, uint256 _item, string memory delistTokenUri) public {
        uint marketId = _nftToMarketId[_nftAddress][_item];
        returnItem(marketId, delistTokenUri);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // internal functions
    function _calculateDomainSeparator() internal view returns (bytes32) {
        return
        keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("LoanNFT")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function _calculateHashStruct(
        address _proxyAddress,
        address _hirer,
        uint256 _deadline
    ) internal view returns (bytes32) {
        return
        keccak256(
            abi.encode(
                HIRE_NFT_WITH_SIG_TYPEHASH,
                _proxyAddress,
                _hireNftSigNonces[_hirer],
                _deadline
            )
        );
    }

    function _transferWrappedNft(address from, address to, uint256 tokenId) internal {
        WrappedERC721 wrapped = WrappedERC721(erc721WrappedAddress);
        wrapped.transferFrom(from, to, tokenId);
    }

    function _mintWrapNft(address originalNftAddress, uint256 originalNftId) internal {
        WrappedERC721 wrapped = WrappedERC721(erc721WrappedAddress);
        ERC721 original = ERC721(originalNftAddress);
        uint256 newTokenId = wrapped.getCurrentTokenId();
        wrapped.safeMint(address(this), original.tokenURI(originalNftId));
        nftToWrappedNftId[originalNftAddress][originalNftId] = newTokenId;
        wrapped.wrap(newTokenId, originalNftAddress, originalNftId);
    }

    function _updateWrappedNft(address originalNftAddress, uint256 originalNftId) internal {
        WrappedERC721 wrapped = WrappedERC721(erc721WrappedAddress);
        ERC721 original = ERC721(originalNftAddress);
        uint256 tokenID = nftToWrappedNftId[originalNftAddress][originalNftId];
        wrapped.setTokenURI(tokenID, original.tokenURI(originalNftId));
    }
    function _removeWrappedNftUri(address originalNftAddress, uint256 originalNftId, string memory tokenUri) internal {
        WrappedERC721 wrapped = WrappedERC721(erc721WrappedAddress);
        uint256 tokenID = nftToWrappedNftId[originalNftAddress][originalNftId];
        wrapped.setTokenURI(tokenID, tokenUri);
    }
}
