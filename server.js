const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5050
const dotenv = require('dotenv').config()

const OpenAI = require('openai').OpenAI
const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY })

app.use(bodyParser.json())
app.use(cors())

app.post('/topic', async (req, res) => {
    try {
        const topic = req.body.topic
        console.log(topic);
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' })
        }
        const question = await generateQuizQuestion(topic)
        const output = JSON.parse(question)
        console.log(output);
        res.json({key: output})
    } catch (error) {
        console.error('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

async function generateQuizQuestion(topic) {
    const prompt = `Create a quiz question that is strictly related to ${topic}. 
        Provide four options for the question, ensuring they are relevant to ${topic}, 
        and designate the correct answer among them. Give me the final output in a JSON format with keys as question, options and answer. 
        Also make sure that options are just an array.
        Please don't repeat the outputs`

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
    })

    const generatedQuestion = response.choices[0].message.content
    // console.log('Generated Question:', generatedQuestion)
    return generatedQuestion
}


app.listen(port, ()=>{
    console.log(`listening to ${port}`)
})