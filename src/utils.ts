// @ts-ignore-line
import axios from "axios";
import { APIError } from "./errors";

/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
async function fetchData(
  url: string,
  headers: Record<string, string> = {}
): Promise<object> {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new APIError(
        error.response.data.message || "API request failed",
        error.response.status
      );
    }
    throw new APIError("Network error or server is unavailable", 500);
  }
}

/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
function buildQueryString(params: Record<string, any> = {}): string {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
function buildURL(baseURL: string, params: Record<string, any> = {}): string {
  const queryString = buildQueryString(params);
  return queryString ? `${baseURL}?${queryString}` : baseURL;
}

const baseTwitterURL: string =
  "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter";
const baseSpotifyURL: string =
  "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
const baseTikTokURL: string =
  "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/tiktok";

const formatAddress = (address: string, n: number = 8): string => {
  return `${address.slice(0, n)}...${address.slice(-n)}`;
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatCampAmount = (amount: number) => {
  if (amount >= 1000) {
    const formatted = (amount / 1000).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "k"
      : formatted + "k";
  }
  return amount.toString();
};

export const sendAnalyticsEvent = async (
  ackee: any,
  event: string,
  key: string,
  value: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && !!ackee) {
      try {
        ackee.action(
          event,
          {
            key: key,
            value: value,
          },
          (res: string) => {
            resolve(res);
          }
        );
      } catch (error) {
        console.error(error);
        reject(error);
      }
    } else {
      reject(
        new Error(
          "Unable to send analytics event. If you are using the library, you can ignore this error."
        )
      );
    }
  });
};

export {
  fetchData,
  buildQueryString,
  buildURL,
  baseTwitterURL,
  baseSpotifyURL,
  baseTikTokURL,
  formatAddress,
  capitalize,
};
