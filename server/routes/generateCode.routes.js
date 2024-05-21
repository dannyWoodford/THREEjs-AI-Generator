import express from 'express'
import * as dotenv from 'dotenv'
import OpenAI from "openai";


dotenv.config()

const router = express.Router()

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

router.route('/').get((req, res) => {
	res.status(200).json({ message: 'Hello from generateCode ROUTES. model: gpt-4o' })
})

router.route('/').post(async (req, res) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: 'user', content: req.body['input'] }],
			// temperature: 0.3,
		});

		const responseCode = response.choices[0].message.content

		res.status(200).json({ code: responseCode })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: `Something went wrong from generateCode ROUTES` })
	}
})

export default router
