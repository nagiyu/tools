import { NextRequest, NextResponse } from 'next/server';

import OpenAIService from '@common/services/OpenAIService';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { OpenAIChatHistory } from '@common/interfaces/OpenAIMessageType';

interface ChatRequest {
    conversationHistory: OpenAIChatHistory;
    userMessage: string;
    options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    };
}

interface ChatResponse {
    message: string;
    updatedHistory: OpenAIChatHistory;
}

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { conversationHistory, userMessage, options } = body;

        if (!conversationHistory || !userMessage) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get OpenAI API key from AWS Secrets Manager
        const env = EnvironmentalUtil.GetProcessEnv();
        const secretName = env === 'production' ? 'Tools' : 'DevTools';
        const apiKey = await SecretsManagerUtil.getSecretValue(secretName, 'OPENAI_API_KEY');

        // Create OpenAI service instance
        const openAIService = new OpenAIService(apiKey);

        // Get AI response
        const aiResponse = await openAIService.continueConversation(
            conversationHistory,
            userMessage,
            options
        );

        // Update conversation history
        const updatedHistory = openAIService.addAssistantResponse(
            [...conversationHistory, { role: 'user', content: userMessage }],
            aiResponse
        );

        const response: ChatResponse = {
            message: aiResponse,
            updatedHistory
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
