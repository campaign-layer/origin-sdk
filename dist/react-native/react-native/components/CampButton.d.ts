import React from 'react';
import { ViewStyle } from 'react-native';
interface CampButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    authenticated?: boolean;
}
export declare const CampButton: React.FC<CampButtonProps>;
export {};
