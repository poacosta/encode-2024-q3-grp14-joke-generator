"use server"

import OpenAI from "openai"
import {z} from "zod"
import type {ChatCompletionMessageParam} from "openai/resources/chat/completions"

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

const SYSTEM_PERSONALITY = {
  role: "system",
  content:
    'You\'re a young American comedian eager to fulfill your fans\' joke requests. Respond with high energy and enthusiasm! Use short, punchy sentences. Tell stories that build up to hilarious punchlines with vivid descriptions. Keep it clean—no explicit profanity—but throw in a "damn" or "hell" now and then for extra oomph.',
} as const

async function chat(
  messages: ChatCompletionMessageParam[],
  temperature: number,
) {
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

// Function to generate a joke using the OpenAI API
export const generateJoke = async (
  topic: string,
  tone: string,
  type: string,
  temperature?: number,
) => {
  const schema = z.object({
    // TODO: These should be using z.nativeEnum()
    topic: z.string().min(1),
    tone: z.string().min(1),
    type: z.string().min(1),
    temperature: z.number().min(0).max(1).optional(),
  })
  try {
    await schema.parseAsync({
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
      temperature ?? 1,
    )
    if (!content) {
      return {error: "No joke!"}
    }
    return content
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: `Validation errors:\n${error.issues
          .map((issue) => `  ${issue.path}: ${issue.message}`)
          .join("\n")}`,
      }
    } else {
      return {
        error: `An unexpected error occurred: ${error}`,
      }
    }
  }
}
