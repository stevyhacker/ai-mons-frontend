import styles from "../styles/NftGallery.module.css";

export default function NftCard({nft}: { nft: any }) {
    return (
        <div className={styles.card_container}>
            <a href={"https://opensea.com/nft/" + nft.contract + "/" + nft.tokenId}>

                <div className={styles.image_container}>
                    <img src={nft.media}></img>
                </div>
                <div className={styles.info_container}>
                    <div className={styles.title_container}>
                        <h3>
                            {nft.title.length > 20
                                ? `${nft.title.substring(0, 15)}...`
                                : nft.title}
                        </h3>
                    </div>
                    <hr className={styles.separator}/>
                    <div className={styles.symbol_contract_container}>
                        <div className={styles.symbol_container}>
                            <p>
                                {nft.collectionName && nft.collectionName.length > 20
                                    ? `${nft.collectionName.substring(0, 20)}`
                                    : nft.collectionName}
                            </p>

                            {nft.verified == "verified" ? (
                                <img
                                    src={
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                                    }
                                    width="20px"
                                    height="20px"
                                    alt={"verified"}
                                />
                            ) : null}
                        </div>
                        <div className={styles.contract_container}>
                            <p className={styles.contract_container}>
                                {nft.contract.slice(0, 6)}...{nft.contract.slice(38)}
                            </p>
                            <img
                                src={
                                    "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg"
                                }
                                width="15px"
                                height="15px"
                                alt={'open sea'}/>
                        </div>

                    </div>

                    <div className={styles.description_container}>
                        <p>{nft.description}</p>
                    </div>
                </div>
            </a>

        </div>
    );
}