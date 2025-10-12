/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef } from 'react';

import { Box, Paper } from '@mui/material';

import ChatMessage, { ChatMessageData } from '@/app/components/chat/ChatMessage';

interface ChatContainerProps {
    messages: ChatMessageData[];
    height?: string | number;
    autoScroll?: boolean;
}

export default function ChatContainer({
    messages,
    height = '500px',
    autoScroll = true,
}: ChatContainerProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (autoScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Paper
            elevation={2}
            sx={{
                height,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {messages.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'text.secondary',
                    }}
                >
                    No messages yet
                </Box>
            ) : (
                <>
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </>
            )}
        </Paper>
    );
}
