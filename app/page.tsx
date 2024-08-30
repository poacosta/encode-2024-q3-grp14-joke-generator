"use client"
import {useState} from "react"
import {Header} from "@/components/header"
import {Filters} from "@/components/filters"
import {Message, Messages} from "@/components/messages"

const SYSTEM_PERSONALITY = {
    role: "system",
    content: "You're a young American comedian eager to fulfill your fans' joke requests. Respond with high energy and enthusiasm! Use short, punchy sentences. Tell stories that build up to hilarious punchlines with vivid descriptions. Keep it clean—no explicit profanity—but throw in a \"damn\" or \"hell\" now and then for extra oomph.",
}

// Function to generate a joke using the OpenAI API
const generateJoke = async (topic: string, tone: string, type: string, temperature: number): Promise<string> => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                SYSTEM_PERSONALITY,
                {
                    role: "system",
                    content: `Generate a joke which will incorporate this tone: ${tone}, this type: ${type}, and focus on this topic: ${topic}.`
                }
            ],
            temperature,
        }),
    })

    const data = await response.json()
    return data.content
}

// Main component
export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [topic, setTopic] = useState("work")
    const [tone, setTone] = useState("witty")
    const [jokeType, setJokeType] = useState("pun")
    const [temperature, setTemperature] = useState([0.5])

    const handleClick = async () => {
        setIsLoading(true)

        try {
            const joke = await generateJoke(topic, tone, jokeType, temperature[0])
            const botMessage: Message = {id: Date.now(), text: joke}
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error("Failed to generate joke:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEvaluation = (messageId: number, evaluation: string[]) => {
        setMessages(prev =>
            prev.map(message =>
                message.id === messageId ? {...message, evaluation} : message
            )
        )
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <Header/>
            <Filters
                topic={topic}
                setTopic={setTopic}
                tone={tone}
                setTone={setTone}
                jokeType={jokeType}
                setJokeType={setJokeType}
                temperature={temperature}
                setTemperature={setTemperature}
                isLoading={isLoading}
                handleClick={handleClick}
            />
            <Messages messages={messages} handleEvaluation={handleEvaluation}/>
        </div>
    );
}
