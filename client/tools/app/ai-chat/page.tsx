'use client';

import React, { useState } from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import ChatContainer from '@client-common/components/data/chat/ChatContainer';
import { ChatMessageData } from '@client-common/components/data/chat/ChatMessage';
import ChatInputField from '@client-common/components/inputs/TextFields/ChatInputField';
import SendButton from '@client-common/components/inputs/buttons/SendButton';
import Person from '@client-common/components/data/icon/Person';
import SmartToy from '@client-common/components/data/icon/SmartToy';

import { OpenAIChatHistory } from '@common/interfaces/OpenAIMessageType';
import ErrorUtil from '@common/utils/ErrorUtil';
import AIChatService from '@/services/AIChatService.client';

export default function AIChatPage() {
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [conversationHistory, setConversationHistory] = useState<OpenAIChatHistory>([
        { role: 'system', content: 'あなたは親切なアシスタントです。' }
    ]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: ChatMessageData = {
            id: Date.now().toString(),
            content: inputText,
            sender: 'user',
            senderName: 'You',
            timestamp: new Date(),
            avatarIcon: <Person />
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const data = await AIChatService.sendMessage(conversationHistory, inputText);

            const aiMessage: ChatMessageData = {
                id: (Date.now() + 1).toString(),
                content: data.message,
                sender: 'system',
                senderName: 'AI',
                timestamp: new Date(),
                avatarIcon: <SmartToy />
            };

            setMessages(prev => [...prev, aiMessage]);
            setConversationHistory(data.updatedHistory);
        } catch (error) {
            const errorMessage: ChatMessageData = {
                id: (Date.now() + 1).toString(),
                content: 'エラーが発生しました。もう一度お試しください。',
                sender: 'system',
                senderName: 'System',
                timestamp: new Date(),
                avatarIcon: <SmartToy />
            };
            setMessages(prev => [...prev, errorMessage]);
            ErrorUtil.throwError('Failed to send message', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
            <BasicStack spacing={3}>
                <BasicStack spacing={1}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>AI Chat</h1>
                    <p style={{ color: '#666', margin: 0 }}>AIとチャットしてみましょう</p>
                </BasicStack>
                
                <ChatContainer 
                    messages={messages} 
                    height="500px" 
                    autoScroll={true}
                />

                <DirectionStack spacing={1} alignItems="flex-end">
                    <ChatInputField
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="メッセージを入力..."
                    />
                    <SendButton
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputText.trim()}
                        label={isLoading ? '送信中...' : '送信'}
                    />
                </DirectionStack>
            </BasicStack>
        </div>
    );
}
