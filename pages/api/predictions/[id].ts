import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("fetching again " + req.query.id)
    const response = await fetch(
        "https://api.replicate.com/v1/predictions/" + req.query.id,
        {
            headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (response.status !== 200) {
        let error = await response.json();
        res.statusCode = 500;
        console.log(error);
        res.end(JSON.stringify({detail: error.detail}));
        return;
    }
    console.log(response);
    const prediction = await response.json();
    res.end(JSON.stringify(prediction));
}