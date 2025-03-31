import React, { JSX, ReactNode, useState, CSSProperties } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div
      className={styles["tooltip-container"]}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={containerStyle}
    >
      {children}
      {isVisible && (
        <div
          className={`${styles.tooltip} ${styles[position]}`}
          style={{ backgroundColor, color: textColor }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
