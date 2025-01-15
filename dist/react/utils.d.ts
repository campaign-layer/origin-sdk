import { ReactNode, JSX } from "react";
/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
export declare const createWrapperAndAppendToBody: (wrapperId: string) => HTMLElement;
interface ReactPortalProps {
    children: ReactNode;
    wrapperId: string;
}
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
export declare const getIconByConnectorName: (name: string) => string;
export {};
