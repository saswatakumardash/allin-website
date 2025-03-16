// app/api/chat/route.ts
import { env } from '@/env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from 'ai';

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

export const runtime = 'edge';

export async function POST(req: Request) {
    const { messages } = (await req.json()) as { messages: Message[] };

    // Get the model - Gemini Pro is a good default choice
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert the messages to the format expected by Google's API
    const googleMessages = messages.map((message: Message) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
    }));

    // Start a chat session
    const chat = model.startChat({
        history: googleMessages.slice(0, -1),
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
        },
    });

    // Send the last message to continue the chat
    const lastMessage = googleMessages[googleMessages.length - 1];

    try {
        // Generate a non-streaming response
        const result = await chat.sendMessage(lastMessage!.parts[0]!.text);
        const responseText = result.response.text();

        // Create a new assistant message
        const newMessage: Message = {
            role: 'assistant',
            content: responseText,
            id: Date.now().toString(),
        };

        // Return the new message
        return new Response(JSON.stringify({ message: newMessage }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error generating response:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}