import React from 'react';
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";

const TOPIC_OPTIONS = [
    {value: "work", label: "Work"},
    {value: "people", label: "People"},
    {value: "animals", label: "Animals"},
    {value: "food", label: "Food"},
    {value: "television", label: "Television"}
];

const TONE_OPTIONS = [
    {value: "witty", label: "Witty"},
    {value: "sarcastic", label: "Sarcastic"},
    {value: "silly", label: "Silly"},
    {value: "dark", label: "Dark"},
    {value: "goofy", label: "Goofy"}
];

const JOKE_TYPE_OPTIONS = [
    {value: "pun", label: "Pun"},
    {value: "knock-knock", label: "Knock-knock"},
    {value: "story", label: "Story"}
];

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    options: { value: string, label: string }[];
    onValueChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({id, label, value, options, onValueChange}) => (
    <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">{label}:</Label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger id={id} className="w-[120px]">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`}/>
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

const Filters = ({
                     topic,
                     setTopic,
                     tone,
                     setTone,
                     jokeType,
                     setJokeType,
                     temperature,
                     setTemperature,
                     isLoading,
                     handleClick
                 }: {
    topic: string,
    setTopic: (value: string) => void,
    tone: string,
    setTone: (value: string) => void,
    jokeType: string,
    setJokeType: (value: string) => void,
    temperature: number[],
    setTemperature: (value: number[]) => void,
    isLoading: boolean,
    handleClick: (e: React.FormEvent) => void,
}) => {
    return (
        <div className="bg-secondary p-4 flex flex-wrap gap-4 items-center justify-center">
            <SelectField
                id="topic"
                label="Topic"
                value={topic}
                options={TOPIC_OPTIONS}
                onValueChange={setTopic}
            />
            <SelectField
                id="tone"
                label="Tone"
                value={tone}
                options={TONE_OPTIONS}
                onValueChange={setTone}
            />
            <SelectField
                id="jokeType"
                label="Type"
                value={jokeType}
                options={JOKE_TYPE_OPTIONS}
                onValueChange={setJokeType}
            />
            <div className="flex items-center gap-2">
                <Label htmlFor="temperature" className="text-sm font-medium">Temperature:</Label>
                <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onValueChange={setTemperature}
                    className="w-[120px]"
                />
                <span className="text-sm text-muted-foreground w-12">{temperature[0].toFixed(1)}</span>
            </div>
            <Button type="submit" disabled={isLoading} onClick={handleClick}>
                {isLoading ? "Generating..." : "Generate"}
            </Button>
        </div>
    )
}

export {Filters};
