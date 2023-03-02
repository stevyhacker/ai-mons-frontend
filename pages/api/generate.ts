import type { NextApiRequest, NextApiResponse } from 'next'

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const requestMethod = req.method;

    switch (requestMethod) {
        case 'POST': {
            console.log("Prompt: " + req.body.prompt);
            const response = await openai.createImage({
                prompt: req.body.prompt,
                n: 1,
                size: "512x512",
            });

            const image_url = response.data.data[0].url;
            res.status(200).json({image_url: `${image_url}`});
            break;
        }
        // handle other HTTP methods
        default:
            res.status(200).json({message: 'Welcome to API Routes!'})
    }
}
