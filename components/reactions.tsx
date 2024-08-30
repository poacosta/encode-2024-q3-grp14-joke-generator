import React from 'react'
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import {Message} from "@/components/messages";

const ICON_CLASS = "h-4 w-4 mr-2";

const toggleItems = [
    {value: "funny", label: "Funny", IconComponent: ThumbsUp},
    {value: "appropriate", label: "Appropriate", IconComponent: ThumbsUp},
    {value: "offensive", label: "Offensive", IconComponent: ThumbsDown},
    {value: "clever", label: "Clever", IconComponent: ThumbsUp},
    {value: "confusing", label: "Confusing", IconComponent: ThumbsDown},
];

const ToggleItem = ({value, label, IconComponent}:
                        { value: string, label: string, IconComponent: typeof ThumbsUp | typeof ThumbsDown }) => (
    <ToggleGroupItem value={value} aria-label={`Toggle ${label.toLowerCase()}`}>
        <IconComponent className={ICON_CLASS}/>
        {label}
    </ToggleGroupItem>
);

const Reactions = ({handleEvaluation, message}: {
    handleEvaluation: (messageId: number, evaluation: string[]) => void,
    message: Message
}) => {
    return (
        <ToggleGroup type="multiple" variant="outline"
                     onValueChange={(value) => handleEvaluation(message.id, value)}>
            {toggleItems.map(item => (
                <ToggleItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    IconComponent={item.IconComponent}
                />
            ))}
        </ToggleGroup>
    )
}

export {Reactions};
