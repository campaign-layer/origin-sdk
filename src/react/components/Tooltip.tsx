import React, { JSX, ReactNode, useState, CSSProperties } from "react";
import ReactDOM from "react-dom";
import styles from "./styles/tooltip.module.css";

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
const Tooltip = ({
  content,
  position = "top",
  backgroundColor = "#333",
  textColor = "#fff",
  containerStyle = {},
  children,
}: TooltipProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVisible(true);
    setTooltipPosition(e.currentTarget.getBoundingClientRect());
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setTooltipPosition(null);
  };

  const tooltipStyles: CSSProperties = {
    backgroundColor,
    color: textColor,
    position: "absolute",
    zIndex: 1000,
    ...getTooltipPosition(tooltipPosition, position),
  };

  return (
    <div
      className={styles["tooltip-container"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={containerStyle}
    >
      {children}
      {isVisible &&
        tooltipPosition &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className={`${styles.tooltip} ${styles[position]} ${styles["show"]}`}
            style={tooltipStyles}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

/**
 * Calculate the position of the tooltip based on the target element's position and the desired tooltip position.
 * Adjusts the position to ensure the tooltip stays within the viewport.
 * @param {DOMRect | null} rect The bounding client rect of the target element.
 * @param {"top" | "bottom" | "left" | "right"} position The desired tooltip position.
 * @returns {CSSProperties} The calculated position styles for the tooltip.
 */
const getTooltipPosition = (
  rect: DOMRect | null,
  position: "top" | "bottom" | "left" | "right"
): CSSProperties => {
  if (!rect) return {};
  if (typeof window === "undefined") return {};
  const spacing = 8; // Space between the tooltip and the target element
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0,
    left = 0,
    transform = "";

  switch (position) {
    case "top":
      top = rect.top - spacing;
      left = rect.left + rect.width / 2;
      transform = "translate(-50%, -100%)";
      if (top < 0) {
        top = rect.bottom + spacing;
        transform = "translate(-50%, 0)";
      }
      break;
    case "bottom":
      top = rect.bottom + spacing;
      left = rect.left + rect.width / 2;
      transform = "translate(-50%, 0)";
      if (top > viewportHeight) {
        top = rect.top - spacing;
        transform = "translate(-50%, -100%)";
      }
      break;
    case "left":
      top = rect.top + rect.height / 2;
      left = rect.left - spacing;
      transform = "translate(-100%, -50%)";
      if (left < 0) {
        left = rect.right + spacing;
        transform = "translate(0, -50%)";
      }
      break;
    case "right":
      top = rect.top + rect.height / 2;
      left = rect.right + spacing;
      transform = "translate(0, -50%)";
      if (left > viewportWidth) {
        left = rect.left - spacing;
        transform = "translate(-100%, -50%)";
      }
      break;
    default:
      break;
  }

  return { top, left, transform };
};

export default Tooltip;
