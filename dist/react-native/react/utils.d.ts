import React, { ReactNode, JSX } from "react";
/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
export declare const createWrapperAndAppendToBody: (wrapperId: string) => HTMLDivElement | null;
interface ReactPortalProps {
    children: ReactNode;
    wrapperId: string;
}
export declare const useIsomorphicLayoutEffect: typeof React.useEffect;
/**
 * The ReactPortal component. Renders children in a portal.
 * @param { { children: JSX.Element, wrapperId: string } } props The props.
 * @returns { JSX.Element } The ReactPortal component.
 */
export declare const ReactPortal: ({ children, wrapperId, }: ReactPortalProps) => JSX.Element | null;
interface ClientOnlyProps {
    children: ReactNode;
}
/**
 * The ClientOnly component. Renders children only on the client. Needed for Next.js.
 * @param { { children: JSX.Element } } props The props.
 * @returns { JSX.Element } The ClientOnly component.
 */
export declare const ClientOnly: ({ children, ...delegated }: ClientOnlyProps) => JSX.Element | null;
/**
 * Returns the icon URL based on the connector name.
 * @param {string} name - The connector name.
 * @returns {string} The icon URL.
 */
export declare const getIconByConnectorName: (name: string) => string;
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} The formatted Camp amount.
 */
export declare const CampAmount: ({ amount, logo, className, }: {
    amount: number;
    logo?: boolean;
    className?: string;
}) => JSX.Element;
export {};
