import {useEffect, useRef, useTransition} from 'react'
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {MessageCircle, Sparkles} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

export type Message = {
    id: number
    text: string
    evaluation?: string[]
    jokeCategory?: string
}

const Messages = ({messages, handleJokeEvaluationClick}: {
    messages: Message[],
    handleJokeEvaluationClick: (messageId: number, message: string) => void,
}) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    return (
        <div className="p-4">
            {messages.map(message => (
                <div key={message.id} className="mb-4">
                    <div className="flex justify-start">
                        <div className="flex items-start max-w-[80%] flex-row">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <MessageCircle className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="mx-2 p-3 rounded-lg bg-secondary text-secondary-foreground">
                                {message.text}
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 ml-8 flex justify-left">
                        {message.jokeCategory ? (
                            <Badge className="bg-black text-white hover:bg-gray-800">
                                {message.jokeCategory}
                            </Badge>
                        ) : (
                            <Button
                                className="mt-2 ml-2"
                                type="button"
                                disabled={isPending}
                                variant="outline"
                                onClick={() => {
                                    startTransition(() => {
                                        handleJokeEvaluationClick(message.id, message.text)
                                    })
                                }}
                            >
                                <Sparkles className="h-4 w-4 mr-2" /> {isPending ? "Evaluating..." : "Evaluate"}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            <div ref={lastMessageRef}/>
        </div>
    )
}

export {Messages};
