import type { ChatCompletionCreateParamsNonStreaming } from "openai/completions";
import { inngest } from "./client.ts";
import { completion } from "@/lib/openai/openai.ts";
import { openai } from "@ai-sdk/openai";
import { completionAISDK } from "@/lib/ai-sdk/openai.ts";

const prompt = {
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: "Write a haiku about recursion in programming.",
    },
  ],
};

export const generateText = inngest.createFunction(
  { id: "generate-text" },
  { event: "openai/generate.text" },
  async ({ event, step }) => {
    const response = await step.ai(
      "generateText",
      (args: ChatCompletionCreateParamsNonStreaming) => completion(args),
      prompt,
    );
    return { event, body: response.choices[0].message.content };
  },
);

const promptAiSdk = {
  model: openai("gpt-3.5-turbo"),
  prompt: "Write a haiku about recursion in programming.",
};

export const generateTextAiSdk = inngest.createFunction(
  { id: "generate-text-ai-sdk" },
  { event: "ai-sdk/generate.text" },
  async ({ event, step }) => {
    console.log("generating text using ai-sdk", event.data);
    const response = await step.ai(
      "generateText",
      (args: any) => completionAISDK(args),
      promptAiSdk,
    );
    return { event, body: response };
  },
);
