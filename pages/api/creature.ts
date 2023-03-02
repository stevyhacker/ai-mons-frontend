import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + process.env.REPLICATE_API_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            version: "3554d9e699e09693d3fa334a79c58be9a405dd021d3e11281256d53185868912",
            input: {prompt: req.body.prompt},
        })
    });

    if (response.status !== 201) {
        let error = await response.json();
        console.log(error);
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();
    console.log(prediction);
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));

}