import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + process.env.REPLICATE_API_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            version: "ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba",
            input: {prompt: req.body.prompt},
        })
    });

    if (response.status !== 201) {
        let error = await response.json();
        // console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();
    // console.log(prediction);
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));

}