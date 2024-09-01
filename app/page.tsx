"use client"
import {useEffect, useState, useTransition} from "react"
import {Header} from "@/components/header"
import {Filters} from "@/components/filters"
import {Message, Messages} from "@/components/messages"
import {generateJoke} from "./actions"

// Main component
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState("work")
  const [tone, setTone] = useState("witty")
  const [jokeType, setJokeType] = useState("pun")
  const [temperature, setTemperature] = useState([1])
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleClick = async () => {
    setIsLoading(true)

    try {
      startTransition(async () => {
        const response = await generateJoke(
          topic,
          tone,
          jokeType,
          temperature[0],
        )
        if (typeof response === "string") {
          const botMessage: Message = {id: Date.now(), text: response}
          setMessages((prev) => [...prev, botMessage])
        } else {
          throw response.error
        }
      })
    } catch (error) {
      console.error("Failed to generate joke:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvaluation = (messageId: number, evaluation: string[]) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? {...message, evaluation} : message,
      ),
    )
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
      <div
        className={`sticky top-0 z-10 bg-background transition-shadow ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
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
          isLoading={isLoading}
          handleClick={handleClick}
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <Messages messages={messages} handleEvaluation={handleEvaluation} />
      </div>
    </div>
  )
}
