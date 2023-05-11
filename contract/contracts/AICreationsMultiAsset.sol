// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@rmrk-team/evm-contracts/contracts/implementations/nativeTokenPay/RMRKMultiAssetImpl.sol";
import "@rmrk-team/evm-contracts/contracts/RMRK/extension/tokenProperties/RMRKTokenProperties.sol";

contract AICreationsMultiAsset is RMRKMultiAssetImpl, RMRKTokenProperties {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(InitData memory data)
    RMRKMultiAssetImpl(
        "AICreations", "AIC", "collectionMetadataTodo", "tokenUriTodo", data)
    {}

    function safeMint(address to, string memory uri) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId, bytes(uri));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, RMRKMultiAsset, RMRKTokenProperties) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}