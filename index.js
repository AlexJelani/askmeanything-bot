import { Configuration, OpenAIApi } from 'openai'
import {initializeApp} from "firebase/app";
import {getDatabase, ref} from 'firebase/database'

let openai;
const apiUrl = import.meta.env.VITE_API_URL;
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        // Use the fetched API key to create the openai object
        const apiKey = data.apiKey;
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        openai = new OpenAIApi(configuration);

        // Continue with any code that uses openai
        // ...
    })
    .catch((error) => {
        console.error('Error fetching API key:', error);
    });



const appSettings = {
    databaseURL: 'https://knowitall-bot-default-rtdb.asia-southeast1.firebasedatabase.app/'
}
const app = initializeApp(appSettings)

const database = getDatabase(app)

const conversationInDb = ref(database)

const chatbotConversation = document.getElementById('chatbot-conversation')

const conversationArr = [{
    role:'system',
    content:'You are a highly knowledgeable assistant that gives veryshort answers.'
}]



document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')

    conversationArr.push({
        role:'user',
        content: userInput.value
    })
    console.log(conversationArr)
    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})
async function fetchReply() {
    const response = await openai.createChatCompletion({
        // Your code here
        model: 'gpt-4',
        messages: conversationArr,
        presence_penalty:0,
        frequency_penalty:0.3
    });
    conversationArr.push(response.data.choices[0].message)
    renderTypewriterText(response.data.choices[0].message.content)
    console.log(conversationArr)
}

// content
//     :
//     "The capital of Georgia (U.S. state) is Atlanta. If you are referring to Georgia, the Eastern European country, the capital is Tbilisi."
// role
//     :
//     "assistant"



function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}
