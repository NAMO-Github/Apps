pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("DemoToken", "DMTK") {
        _mint(msg.sender, 100000 ether);
    }

    function mint(uint256 _amount, address _receiver) public onlyOwner {
        _mint(_receiver, _amount);
    }
}
