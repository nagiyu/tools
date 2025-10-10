import { NextRequest } from 'next/server';

import OpenAIService from '@common/services/OpenAIService';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { OpenAIChatHistory, OpenAIChatOptions } from '@common/interfaces/OpenAIMessageType';
import APIUtil from '@client-common/utils/APIUtil';

interface ChatRequest {
    conversationHistory: OpenAIChatHistory;
    userMessage: string;
    options?: OpenAIChatOptions;
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
            return APIUtil.ReturnBadRequest('Missing required fields');
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

        return APIUtil.ReturnSuccessWithObject(response);
    } catch (error) {
        console.error('Error in chat API:', error);
        return APIUtil.ReturnInternalServerErrorWithError(error);
    }
}
