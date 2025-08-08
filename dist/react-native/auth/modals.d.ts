import React from "react";
interface CampModalProps {
    projectId?: string;
    onWalletConnect?: (provider: any) => void;
}
declare const CampModal: ({ projectId, onWalletConnect }: CampModalProps) => React.JSX.Element;
export { CampModal };
