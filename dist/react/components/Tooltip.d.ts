import { JSX, ReactNode, CSSProperties } from "react";
interface TooltipProps {
    content: string | ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    backgroundColor?: string;
    textColor?: string;
    containerStyle?: CSSProperties;
    children: ReactNode;
}
/**
 * Tooltip component to wrap other components and display a tooltip on hover.
 * Uses portals to render the tooltip outside of its parent container.
 * @param {TooltipProps} props The props for the Tooltip component.
 * @returns {JSX.Element} The Tooltip component.
 */
declare const Tooltip: ({ content, position, backgroundColor, textColor, containerStyle, children, }: TooltipProps) => JSX.Element;
export default Tooltip;
