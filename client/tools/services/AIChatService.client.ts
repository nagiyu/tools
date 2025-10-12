import ErrorUtil from '@common/utils/ErrorUtil';
import { ChatRequest, ChatResponse } from '@/app/api/chat/route';

export default class AIChatService {
    /**
     * Send a message to the AI chat API
     * @param conversationHistory The conversation history
     * @param userMessage The user's message
     * @returns Promise with AI response and updated history
     */
    public static async sendMessage(
        conversationHistory: ChatRequest['conversationHistory'],
        userMessage: string
    ): Promise<ChatResponse> {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationHistory,
                    userMessage,
                } as ChatRequest),
            });

            if (!response.ok) {
                ErrorUtil.throwError('Failed to get response from AI');
            }

            const data: ChatResponse = await response.json();
            return data;
        } catch (error) {
            ErrorUtil.throwError('Error sending message to AI', error);
        }
    }
}
