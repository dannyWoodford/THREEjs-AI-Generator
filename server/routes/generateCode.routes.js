import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const router = express.Router()

const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

router.route('/').get((req, res) => {
	res.status(200).json({ message: 'Hello from generateCode ROUTES' })
})

router.route('/').post(async (req, res) => {
	try {
		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: req.body['input'] }],
			temperature: 0.6,
		})

		const responseCode = response.data.choices[0].message.content

		res.status(200).json({ code: responseCode })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: `Something went wrong from generateCode ROUTES` })
	}
})

export default router
