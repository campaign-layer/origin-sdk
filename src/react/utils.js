import { createPortal } from "react-dom";
import React, { useLayoutEffect, useState, useEffect } from "react";

/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
export const createWrapperAndAppendToBody = (wrapperId) => {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

/**
 * The ReactPortal component. Renders children in a portal.
 * @param { { children: JSX.Element, wrapperId: string } } props The props.
 * @returns { JSX.Element } The ReactPortal component.
 */
export const ReactPortal = ({
  children,
  wrapperId = "react-portal-wrapper",
}) => {
  const [wrapperElement, setWrapperElement] = useState(null);
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};

/**
 * The ClientOnly component. Renders children only on the client. Needed for Next.js.
 * @param { { children: JSX.Element } } props The props.
 * @returns { JSX.Element } The ClientOnly component.
 */
export const ClientOnly = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
};
