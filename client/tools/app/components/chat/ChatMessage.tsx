'use client';

import React from 'react';

import { Box, Typography, Avatar } from '@mui/material';

export interface ChatMessageData {
    id: string;
    content: string;
    sender: 'user' | 'system';
    senderName?: string;
    timestamp?: Date;
    avatarIcon?: React.ReactNode;
}

interface ChatMessageProps {
    message: ChatMessageData;
}

export default function ChatMessage({
    message
}: ChatMessageProps) {
    const isUser = message.sender === 'user';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 1,
                mb: 2,
            }}
        >
            {message.avatarIcon && (
                <Avatar
                    sx={{
                        bgcolor: isUser ? 'primary.main' : 'grey.400',
                        width: 40,
                        height: 40,
                    }}
                >
                    {message.avatarIcon}
                </Avatar>
            )}
            <Box
                sx={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
            >
                {message.senderName && (
                    <Typography
                        variant="caption"
                        sx={{
                            mb: 0.5,
                            px: 1,
                            color: 'text.secondary',
                        }}
                    >
                        {message.senderName}
                    </Typography>
                )}
                <Box
                    sx={{
                        bgcolor: isUser ? 'primary.main' : 'grey.200',
                        color: isUser ? 'primary.contrastText' : 'text.primary',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        wordBreak: 'break-word',
                    }}
                >
                    <Typography 
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {message.content}
                    </Typography>
                </Box>
                {message.timestamp && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            px: 1,
                            color: 'text.secondary',
                        }}
                    >
                        {message.timestamp.toLocaleTimeString()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
