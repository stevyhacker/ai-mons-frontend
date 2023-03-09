import styles from "../styles/NftGallery.module.css";
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import NftCard from "./NftCard";

export default function NftGallery({
                                       walletAddress,
                                       collectionAddress,
                                       chain,
                                       pageSize,
                                   }) {
    const [nfts, setNfts] = useState();
    const [isLoading, setIsloading] = useState(false);
    const {address, isConnected, isDisconnected} = useAccount();
    const [pageKey, setPageKey] = useState();
    const [excludeFilter, setExcludeFilter] = useState(true);

    const fetchNfts = () => {
        if (collectionAddress) {
            getNftsForCollection();
        } else if (walletAddress || address) {
            getNftsForOwner();
        }
    };
    const getNftsForOwner = async () => {
        setIsloading(true);
        if (isConnected || walletAddress) {
            try {
                const res = await fetch("/api/getNftsForOwner", {
                    method: "POST",
                    body: JSON.stringify({
                        address: walletAddress ? walletAddress : address,
                        pageSize: pageSize,
                        chain: chain,
                        pageKey: pageKey ? pageKey : null,
                        excludeFilter: excludeFilter,
                    }),
                }).then((res) => res.json());
                console.log(res);

                setNfts(res.nfts);
                if (res.pageKey) setPageKey(res.pageKey);
            } catch (e) {
                console.log(e);
            }
        }

        setIsloading(false);
    };

    const getNftsForCollection = async () => {
        setIsloading(true);

        if (collectionAddress) {
            try {
                const res = await fetch("/api/getNftsForCollection", {
                    method: "POST",
                    body: JSON.stringify({
                        address: collectionAddress ? collectionAddress : address,
                        pageSize: pageSize,
                        chain: chain,
                        pageKey: pageKey ? pageKey : null,
                        excludeFilter: excludeFilter,
                    }),
                }).then((res) => res.json());

                setNfts(res.nfts);
                if (res.pageKey) setPageKey(res.pageKey);
            } catch (e) {
                console.log(e);
            }
        }

        setIsloading(false);
    };

    useEffect(() => {
        fetchNfts();
    }, []);

    if (isDisconnected) return <p>Loading...</p>;

    return (
        <div className={styles.nft_gallery_page_container}>
            <div className={styles.nft_gallery}>
                <div className={styles.nfts_display}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : nfts?.length ? (
                        nfts.map((nft) => {
                            return <NftCard key={nft.tokenId} nft={nft}/>;
                        })
                    ) : (
                        <p>No NFTs found for the selected address</p>
                    )}
                </div>
            </div>

            {pageKey && (
                <div className={styles.button_container}>
                    <a
                        className={styles.button_black}
                        onClick={() => {
                            fetchNfts();
                        }}
                    >
                        Load more
                    </a>
                </div>
            )}
        </div>
    );
}

