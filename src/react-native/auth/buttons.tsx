import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface CampButtonProps {
  onPress: () => void;
  authenticated: boolean;
  disabled?: boolean;
  style?: any;
}

const CampButton = ({ onPress, authenticated, disabled, style }: CampButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        authenticated ? styles.authenticatedButton : styles.unauthenticatedButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, authenticated && styles.authenticatedText]}>
        {authenticated ? "My Camp" : "Connect"}
      </Text>
    </TouchableOpacity>
  );
};

interface LinkButtonProps {
  social: string;
  variant?: "default" | "icon";
  theme?: "default" | "camp";
  style?: any;
  onPress?: () => void;
}

const LinkButton = ({ social, variant = "default", theme = "default", style, onPress }: LinkButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.linkButton,
        theme === "camp" && styles.campTheme,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.linkButtonText}>
        {variant === "icon" ? "🔗" : `Link ${social}`}
      </Text>
    </TouchableOpacity>
  );
};

const LoadingSpinner = ({ size = "large", color = "#FF6D01" }) => (
  <ActivityIndicator size={size as 'small' | 'large'} color={color} />
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  unauthenticatedButton: {
    backgroundColor: "#FF6D01",
  },
  authenticatedButton: {
    backgroundColor: "#2D5A66",
  },
  disabledButton: {
    backgroundColor: "#D1D1D1",
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  authenticatedText: {
    color: "#F9F6F2",
  },
  linkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F9F6F2",
    borderWidth: 1,
    borderColor: "#D1D1D1",
  },
  campTheme: {
    backgroundColor: "#FF9160",
    borderColor: "#FF6D01",
  },
  linkButtonText: {
    color: "#2B2B2B",
    fontSize: 14,
    fontWeight: "500",
  },
});

export { CampButton, LinkButton, LoadingSpinner };
