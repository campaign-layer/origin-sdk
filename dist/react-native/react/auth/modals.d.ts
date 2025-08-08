import { JSX } from "react";
interface CampModalProps {
    injectButton?: boolean;
    wcProjectId?: string;
    onlyWagmi?: boolean;
    defaultProvider?: any;
}
/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
export declare const CampModal: ({ injectButton, wcProjectId, onlyWagmi, defaultProvider, }: CampModalProps) => JSX.Element;
/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
export declare const MyCampModal: ({ wcProvider, }: {
    wcProvider: any;
}) => JSX.Element;
export {};
