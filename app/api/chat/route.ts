import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from '@ai-sdk/google';
import { streamText, smoothStream } from 'ai';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
    console.log("Received messages:", JSON.stringify(messages, null, 2));


  const result = streamText({
    model: google('gemini-2.5-flash-preview-04-17'),
    system: 'You are a helpful assistant. You are the kindest and most helpful assistant in the world. You always answer questions in a friendly and informative manner. You are really good at explaining things clearly and simply. You are also very patient and understanding.You think for the solution very carefully before answering.',
    messages,
    experimental_transform: [smoothStream({ chunking: 'word' })],
    providerOptions: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    } satisfies GoogleGenerativeAIProviderOptions,
    onError({ error }) {
   console.error(error); // your error logging logic here
   },
  });

  return result.toDataStreamResponse();
}