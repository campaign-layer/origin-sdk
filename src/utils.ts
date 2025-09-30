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

/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
const formatAddress = (address: string, n: number = 8): string => {
  return `${address.slice(0, n)}...${address.slice(-n)}`;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
export const formatCampAmount = (amount: number) => {
  if (amount >= 1000) {
    const formatted = (amount / 1000).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "k"
      : formatted + "k";
  }
  return amount.toString();
};

interface UploadProgressCallback {
  (percent: number): void;
}

interface UploadWithProgress {
  (
    file: File,
    url: string,
    onProgress: UploadProgressCallback
  ): Promise<string>;
}

/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
export const uploadWithProgress: UploadWithProgress = (
  file,
  url,
  onProgress
) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        ...(typeof window !== "undefined" && typeof onProgress === "function"
          ? {
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percent =
                    (progressEvent.loaded / progressEvent.total) * 100;
                  onProgress(percent);
                }
              },
            }
          : {}),
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        const message =
          error?.response?.data || error?.message || "Upload failed";
        reject(message);
      });
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
