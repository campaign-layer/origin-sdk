import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const CampIcon = ({ width = 16, height = 16 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.7 }] }, "\uD83C\uDFD5\uFE0F")));
const CloseIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\u2715")));
const TwitterIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DA1F2' }] }, "\uD835\uDD4F")));
const DiscordIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#5865F2' }] }, "\uD83D\uDCAC")));
const SpotifyIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DB954' }] }, "\uD83C\uDFB5")));
const TikTokIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\uD83C\uDFAC")));
const TelegramIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#0088cc' }] }, "\u2708\uFE0F")));
const CheckMarkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#22c55e' }] }, "\u2713")));
const XMarkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#ef4444' }] }, "\u2717")));
const LinkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\uD83D\uDD17")));
const getIconBySocial = (social) => {
    switch (social.toLowerCase()) {
        case 'twitter':
            return TwitterIcon;
        case 'discord':
            return DiscordIcon;
        case 'spotify':
            return SpotifyIcon;
        case 'tiktok':
            return TikTokIcon;
        case 'telegram':
            return TelegramIcon;
        default:
            return TwitterIcon;
    }
};
const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export { CampIcon, CheckMarkIcon, CloseIcon, DiscordIcon, LinkIcon, SpotifyIcon, TelegramIcon, TikTokIcon, TwitterIcon, XMarkIcon, getIconBySocial };
