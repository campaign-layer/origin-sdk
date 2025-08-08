import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CampIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 16, 
  height = 16 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.7 }]}>🏕️</Text>
  </View>
);

export const CloseIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8 }]}>✕</Text>
  </View>
);

export const TwitterIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DA1F2' }]}>𝕏</Text>
  </View>
);

export const DiscordIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#5865F2' }]}>💬</Text>
  </View>
);

export const SpotifyIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DB954' }]}>🎵</Text>
  </View>
);

export const TikTokIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8 }]}>🎬</Text>
  </View>
);

export const TelegramIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#0088cc' }]}>✈️</Text>
  </View>
);

export const CheckMarkIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#22c55e' }]}>✓</Text>
  </View>
);

export const XMarkIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#ef4444' }]}>✗</Text>
  </View>
);

export const LinkIcon: React.FC<{ width?: number; height?: number }> = ({ 
  width = 24, 
  height = 24 
}) => (
  <View style={[styles.iconContainer, { width, height }]}>
    <Text style={[styles.iconText, { fontSize: Math.min(width, height) * 0.8 }]}>🔗</Text>
  </View>
);

export const getIconBySocial = (social: string) => {
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
