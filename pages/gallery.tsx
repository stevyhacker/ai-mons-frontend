import NftGallery from "../components/NftGallery";
import React from "react";

export default function Gallery() {
    return (
        <div >
            <h1>Gallery</h1>
            <NftGallery walletAddress={""} collectionAddress={process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS} chain={"MATIC_MAINNET"} pageSize={10}/>
        </div>
    );
}