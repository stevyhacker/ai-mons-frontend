import {ConnectButton} from "@rainbow-me/rainbowkit";
import type {NextPage} from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {Button, Image, Progress, Input, CircularProgress} from "@chakra-ui/react";
import contractAbi from "../public/AICreations.json"
import React, {useState} from "react";
import {Contract, ethers} from "ethers";
import {useAccount, useSigner} from "wagmi";
import NftGallery from "../components/NftGallery";
import {repeat} from "rxjs/operators";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Aimon = {
    level: number;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;
};
const Home: NextPage = () => {

        const [promptInput, setPromptInput] = useState<string>("");
        const [creatureImg, setCreatureImg] = useState<string>("https://replicate.com/api/models/lambdal/text-to-pokemon/files/4d12a241-fd84-4b0a-8321-80dd8c6ae784/out-0.png");
        const [isLoading, setLoading] = useState<boolean>(false);
        const [isMinting, setMinting] = useState<boolean>(false);
        const [prediction, setPrediction] = useState(null);
        const [aimon, setAimon] = useState<Aimon>({
            level: 1
            , hp: 1, attack: 1, defense: 1, speed: 1, special: 1
        });
        const {address} = useAccount();
        const {data: signer} = useSigner();
        const [backstory, setBackstory] = useState('');


        async function generateCreature(e: React.MouseEvent<HTMLButtonElement>) {
            e.preventDefault();
            if (promptInput.length === 0) {
                alert("Please enter a prompt");
                return;
            }
            if (isLoading) {
                alert("Please wait for the current generation to finish");
                return;
            }

            setLoading(true);
            const response = await fetch("/api/creature", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prompt: promptInput}),
            });

            if (response.status !== 201) {
                throw new Error(`Error: ${response.status}`);
            }

            let prediction = await response.json();
            setPrediction(prediction);
            while (
                prediction.status !== "succeeded" &&
                prediction.status !== "failed"
                ) {
                await sleep(500);
                // console.log("waiting for prediction to finish " + prediction.id);
                const response = await fetch("/api/predictions/" + prediction.id);
                prediction = await response.json();
                if (response.status !== 200) {
                    console.log(prediction.detail);
                    return;
                }
                // console.log({prediction})
                setPrediction(prediction);
                if (prediction.output != null) {
                    setCreatureImg(prediction.output[prediction.output.length - 1]);
                    setLoading(false);
                }
            }

            setAimon({
                level: 1,
                hp: Math.floor(Math.random() * 10) + 1,
                attack: Math.floor(Math.random() * 10) + 1,
                defense: Math.floor(Math.random() * 10) + 1,
                speed: Math.floor(Math.random() * 10) + 1,
                special: Math.floor(Math.random() * 10) + 1
            })

        }

        function handlePromptInput(e: React.ChangeEvent<HTMLInputElement>) {
            setPromptInput(e.target.value)
        }

        async function generateStory() {
            console.log('Generating story');

            const response = await fetch("/api/storymaker", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({promptInput}),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            // trims unfinished sentence if any
            const lastDotIndex = data.message.lastIndexOf('.');
            setBackstory(data.message.slice(0, lastDotIndex + 1));
        }

        async function mintNft() {
            setMinting(true);
            const response = await fetch("/api/ipfs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({prompt: promptInput, image_url: creatureImg, story: backstory, stats: aimon}),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const nftContractAddress = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS || '';
            const data = await response.json();
            console.log('POST: ', data);
            console.log("Minting NFT");
            const nftContract = new Contract(nftContractAddress, contractAbi.abi, signer);
            try {
                const mintTx = await nftContract.safeMint(address, data.ipfs_url, {value: ethers.utils.parseEther('1')});
                setLoading(false);
                setMinting(false);
                console.log(mintTx?.hash);
                await mintTx.wait();
            } catch (e) {
                console.log(e);
                setLoading(false);
                setMinting(false);
            }
        }

        function evolve() {
            alert('Evolve coming soon!');
        }

        return (
            <div className={styles.container}>
                <Head>
                    <title>Aimons.xyz</title>
                    <meta
                        name="description"
                        content="Generate your own AiMon and mint it as an NFT on the Polygon network."
                    />
                    <link rel="icon" href="/favicon/favicon.ico"/>
                </Head>

                <main className={styles.main}>
                    <ConnectButton/>

                    <h1 className={styles.title}>Aimon Creature generator</h1>

                    <p className={styles.description}>
                        To generate a new AiMon press Generate and wait a few seconds.
                        <br/>
                        To unlock <b>evolutions</b> mint your creature as an NFT on the
                        Polygon network.
                    </p>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Input
                                value={promptInput}
                                onChange={handlePromptInput}
                                placeholder="Your AiMon prompt - example: baby yoda"
                                margin={2}
                            />
                            <Button onClick={generateCreature} background={"#86C8BC"} margin={2}>
                                Generate Creature
                            </Button>

                            {isLoading &&
                                <div><Progress colorScheme='teal' size='xs' isIndeterminate/>
                                    {prediction && (
                                        <div>
                                            <p>status: {prediction.status}</p>
                                        </div>
                                    )} </div>
                            }

                            <Image
                                margin={5}
                                boxSize="450px"
                                src={creatureImg}
                                alt="Creature"
                            />
                            <Button onClick={generateStory} background={"#86C8BC"} >
                                Generate Backstory
                            </Button>
                            <p className={styles.storytext}>{backstory}</p>
                            <div className={styles.card}>
                                <p>Level: 1</p>
                                <p>HP: {'★'.repeat(aimon.hp)}</p>
                                <p>Attack: {'★'.repeat(aimon.attack)}</p>
                                <p>Defense: {'★'.repeat(aimon.defense)}</p>
                                <p>Speed: {'★'.repeat(aimon.speed)}</p>
                                <p>Special: {'★'.repeat(aimon.special)}</p>
                            </div>
                            <Button onClick={mintNft} background={"#86C8BC"} margin={2}>
                                Mint NFT
                            </Button>

                            <Button onClick={evolve} background={"#86C8BC"} disabled margin={2}>
                                Evolve
                            </Button>

                            {isMinting &&
                                <div><Progress colorScheme='teal' size='xs' isIndeterminate/>
                                    Your wallet will prompt you to confirm the transaction.
                                </div>
                            }
                        </div>

                    </div>

                    <h2 className={styles.title}>Existing Aimons</h2>
                    <NftGallery collectionAddress={process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS}
                                chain={"MATIC_MUMBAI"}
                                pageSize={10} walletAddress={undefined}/>

                    {/*<a href={'https://opensea.io/collection/ai-creations'} target={'_blank'} rel="noreferrer"> Collection </a>*/}

                </main>

                <footer className={styles.footer}>
                    <a href={'/gallery'} target={'_blank'} rel="noreferrer"> Gallery page</a>

                    <a href="https://stevyhacker.github.io" target="_blank" rel="noopener noreferrer">
                        Made by @stevyhacker
                    </a>
                </footer>
            </div>
        );
    }
;

export default Home;
