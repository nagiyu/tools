import { NextRequest } from 'next/server';

import OpenAIService from '@common/services/OpenAIService';
import SecretsManagerUtil from '@common/aws/SecretsManagerUtil';
import EnvironmentalUtil from '@common/utils/EnvironmentalUtil';
import { BadRequestError } from '@common/errors';
import { OpenAIChatHistory, OpenAIChatOptions } from '@common/interfaces/OpenAIMessageType';

import APIUtil, { APIResponseOptions } from '@client-common/utils/APIUtil';

import { ROOT_FEATURE, ToolsFeature } from '@tools/consts/ToolsConsts';

export interface ChatRequest {
    conversationHistory: OpenAIChatHistory;
    userMessage: string;
    options?: OpenAIChatOptions;
}

export interface ChatResponse {
    message: string;
    updatedHistory: OpenAIChatHistory;
}

const options: APIResponseOptions = {
    rootFeature: ROOT_FEATURE,
    feature: ToolsFeature.CHAT,
};

export async function POST(request: NextRequest) {
    return APIUtil.apiHandler(async () => {
        const body: ChatRequest = await request.json();
        const { conversationHistory, userMessage, options } = body;

        if (!conversationHistory || !userMessage) {
            throw new BadRequestError('Missing required fields');
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

        return response;
    }, options);
}
