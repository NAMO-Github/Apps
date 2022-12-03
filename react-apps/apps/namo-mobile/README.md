## Project structure

<pre>
src
|-- assets
|   |-- fonts
|   |-- images
|-- containers
|   |-- home
|   |   |-- com
|   |   |   |-- search-nft
|   |   |   |   |-- SearchBar.tsx
|   |   |   |-- nft-list
|   |   |   |   |-- NFTItems.tsx
|   |   |   |   |-- NFTList.tsx
|   |-- layout
|   |   |-- AppLayout.tsx
|   |   |-- AppHeader.tsx
|   |-- models
|   |   |-- nft.ts
|   |-- routes
|   |   |-- App.route.tsx
|   |   |-- MainTabs.route.tsx
|   |-- screens
|   |   |-- home
|   |   |   |-- Home.tsx
|   |-- service (internal react native services)
|   |   |-- navigation.ts
|   |-- types
|   |   |-- react-translation.d.ts
</pre>

Please create all utils, components (presentation component aka dumb component), service (api connection, web3 connection) in library folder
