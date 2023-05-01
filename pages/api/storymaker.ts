// pages/api/storymaker.ts
import {NextApiRequest, NextApiResponse} from 'next';

const {Configuration, OpenAIApi} = require("openai");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const prompt = req.body.promptInput;

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        console.log('prompt', prompt)
        try {

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: "tell a short backstory of "+ prompt,
                max_tokens: 150,
                temperature: 0,
            });
            const message = response.data.choices[0]?.text.trim();
            console.log('message', message);
            console.log('response.data', response.data);
            res.status(200).json({message});
        } catch (error) {
            console.error('Error fetching from ChatGPT API:', error);
            res.status(500).json({error: 'Error fetching from ChatGPT API'});
        }
    } else {
        res.status(405).json({error: 'Method not allowed'});
    }
};

export default handler;
