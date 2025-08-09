import React from 'react';
interface CampModalProps {
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}
export declare const CampModal: React.FC<CampModalProps>;
export {};
