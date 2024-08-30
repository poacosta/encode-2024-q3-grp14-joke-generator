import React, {useEffect, useRef} from 'react'
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {MessageCircle} from "lucide-react";
import {Reactions} from "@/components/reactions";

export type Message = {
    id: number
    text: string
    evaluation?: string[]
}

const Messages = ({messages, handleEvaluation}: {
    messages: Message[],
    handleEvaluation: (messageId: number, evaluation: string[]) => void
}) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);

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
                    <div className="mt-2 flex justify-center">
                        <Reactions handleEvaluation={handleEvaluation} message={message}/>
                    </div>
                </div>
            ))}
            <div ref={lastMessageRef}/>
        </div>
    )
}

export {Messages};
