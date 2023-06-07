import {NextApiRequest, NextApiResponse} from "next";

const fs = require('fs')

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({pinataJWTKey: process.env.PINATA_JWT});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const requestMethod = req.method;

    switch (requestMethod) {
        case 'POST': {
            const imageResponse = await fetch(req.body.image_url);
            const blob = await imageResponse.blob();
            fs.writeFileSync('/tmp/image.png', Buffer.from(await blob.arrayBuffer()));
            const file = fs.createReadStream('image.png');

            pinata.pinFileToIPFS(file,
                {
                    pinataMetadata: {
                        name: 'AI Generated NFT image',
                    },
                    pinataOptions: {
                        cidVersion: 1,
                    }
                }
            ).then((response) => {
                console.log(response);
                pinata.pinJSONToIPFS({
                    "name": req.body.prompt,
                    "image": `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`,
                    "description": req.body.story,
                    "attributes": req.body.stats,
                }).then((response) => {
                    console.log(response);
                    res.status(200).json({ipfs_url: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`});
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
            break;
        }
        // handle other HTTP methods
        default:
            pinata.testAuthentication().then((result) => {
                //handle successful authentication here
                console.log(result);
            }).catch((err) => {
                //handle error here
                console.log(err);
            });
            res.status(200).json({message: 'Welcome to API Routes!'})
    }
}
