"use server"

import OpenAI from "openai"
import {z} from "zod"
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions"
import {formatErrorMessage} from "@/lib/errors"

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const SYSTEM_PERSONALITY = {
  role: "system",
  content:
    'You\'re a young American comedian eager to fulfill your fans\' joke requests. Respond with high energy and enthusiasm! Use short, punchy sentences. Tell stories that build up to hilarious punchlines with vivid descriptions. Keep it clean—no explicit profanity—but throw in a "damn" or "hell" now and then for extra oomph.',
} as const

async function chat(messages: ChatCompletionMessageParam[], temperature: number) {
  const {data, response} = await openai.chat.completions
    .create({
      model: "gpt-4o-mini",
      messages,
      temperature,
    })
    .withResponse()

  if (response.status !== 200) {
    throw new Error(`OpenAI API returned an error: ${response.statusText}`)
  } else if (data.choices.length === 0) {
    throw new Error(`OpenAI API returned no choices`)
  }

  return data.choices[0].message.content
}

const generateJokeSchema = z.object({
  // TODO: These should be using z.nativeEnum()
  topic: z.string().min(1),
  tone: z.string().min(1),
  type: z.string().min(1),
  temperature: z.number().min(0).max(1).optional(),
})

// Function to generate a joke using the OpenAI API
export const generateJoke = async (
  topic: string,
  tone: string,
  type: string,
  temperature: number = 1,
): Promise<string | {error: string}> => {
  try {
    await generateJokeSchema.parseAsync({
      topic,
      tone,
      type,
      temperature,
    })

    const content = await chat(
      [
        SYSTEM_PERSONALITY,
        {
          role: "system",
          content: `Generate a joke which will incorporate this tone: ${tone}, this type: ${type}, and focus on this topic: ${topic}.`,
        },
      ],
      temperature,
    )
    if (!content) {
      return {error: "No joke!"}
    }
    return content
  } catch (error) {
    return {error: formatErrorMessage(error)}
  }
}

const evaluateJokeSchema = z.object({
  joke: z.string().min(1),
  temperature: z.number().min(0).max(1).optional(),
})

// Function to evaluate if joke is funny, appropriate a joke using the OpenAI API
export const evaluateJoke = async (joke: string, temperature: number = 1): Promise<string | {error: string}> => {
  try {
    await evaluateJokeSchema.parseAsync({
      joke,
      temperature,
    })

    const content = await chat(
      [
        {
          role: "system",
          content: `You evaluate the joke given and return a one word answer. The joke can be evaluated as funny, appropriate, offensive, clever or confusing.
                               Return "Unknown", if you can't evaluate the joke`,
        },
        {
          role: "user",
          content: `${joke}`,
        },
      ],
      temperature,
    )
    if (!content) {
      return {error: "No evaluation!"}
    }
    return content
  } catch (error) {
    return {error: formatErrorMessage(error)}
  }
}
