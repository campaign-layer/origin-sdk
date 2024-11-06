import { useContext } from "react";
import { CampContext } from "../context/CampContext";

/**
 * @returns {Auth} The instance of the Auth class.
 * @example
 * import { useAuth } from "./auth/index.js";
 * const auth = useAuth();
 * 
 */
export const useAuth = () => {
  const { auth } = useContext(CampContext);
  return auth;
};
