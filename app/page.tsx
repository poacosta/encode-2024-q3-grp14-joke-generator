"use client"
import {useEffect, useState} from "react"
import {Header} from "@/components/header"
import {Filters} from "@/components/filters"
import {Message, Messages} from "@/components/messages"
import {evaluateJoke, generateJoke} from "./actions"

// Main component
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [topic, setTopic] = useState("work")
  const [tone, setTone] = useState("witty")
  const [jokeType, setJokeType] = useState("pun")
  const [temperature, setTemperature] = useState([1])
  const [isScrolled, setIsScrolled] = useState(false)

  const handleClick = async () => {
    const response = await generateJoke(topic, tone, jokeType, temperature[0])
    if (typeof response === "string") {
      const botMessage: Message = {id: Date.now(), text: response}
      setMessages(prev => [...prev, botMessage])
    } else {
      // TODO: Display an error message
      console.error("Failed to generate joke:", response.error)
    }
  }

  const handleJokeEvaluationClick = async (messageId: number, message: string) => {
    const response = await evaluateJoke(message, temperature[0])
    if (typeof response === "string") {
      setMessages(prev => prev.map(msg => (msg.id === messageId ? {...msg, jokeCategory: response} : msg)))
    } else {
      // TODO: Display an error message
      console.error("Failed to evaluate joke:", response.error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col h-screen w-full">
      <div className={`sticky top-0 z-10 bg-background transition-shadow ${isScrolled ? "shadow-md" : ""}`}>
        <Header />
        <Filters
          topic={topic}
          setTopic={setTopic}
          tone={tone}
          setTone={setTone}
          jokeType={jokeType}
          setJokeType={setJokeType}
          temperature={temperature}
          setTemperature={setTemperature}
          handleClick={handleClick}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <Messages messages={messages} handleJokeEvaluationClick={handleJokeEvaluationClick} />
      </div>
    </div>
  )
}
