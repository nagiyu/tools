'use client';

import React, { useState } from 'react';

import { Box, Container, Typography } from '@mui/material';

import ChatContainer from '@client-common/components/data/chat/ChatContainer';
import { ChatMessageData } from '@client-common/components/data/chat/ChatMessage';
import ChatInputField from '@client-common/components/inputs/TextFields/ChatInputField';
import SendButton from '@client-common/components/inputs/buttons/SendButton';
import Person from '@client-common/components/data/icon/Person';
import SmartToy from '@client-common/components/data/icon/SmartToy';

import { OpenAIChatHistory } from '@common/interfaces/OpenAIMessageType';

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
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationHistory,
                    userMessage: inputText,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

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
            console.error('Error sending message:', error);
            const errorMessage: ChatMessageData = {
                id: (Date.now() + 1).toString(),
                content: 'エラーが発生しました。もう一度お試しください。',
                sender: 'system',
                senderName: 'System',
                timestamp: new Date(),
                avatarIcon: <SmartToy />
            };
            setMessages(prev => [...prev, errorMessage]);
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                AI Chat
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                AIとチャットしてみましょう
            </Typography>
            
            <Box sx={{ mb: 2 }}>
                <ChatContainer 
                    messages={messages} 
                    height="500px" 
                    autoScroll={true}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
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
            </Box>
        </Container>
    );
}
