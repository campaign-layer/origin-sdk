// @ts-ignore-line
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
    const response = await fetch(url, { 
      method: 'GET',
      headers 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || "API request failed",
        response.status
      );
    }
    
    return await response.json();
  } catch (error: any) {
    if (error instanceof APIError) {
      throw error;
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

/**
 * Sends an analytics event to the Ackee server.
 * @param {any} ackee - The Ackee instance.
 * @param {string} event - The event name.
 * @param {string} key - The key for the event.
 * @param {number} value - The value for the event.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
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
    // Try to use XMLHttpRequest for progress tracking if available
    if (typeof XMLHttpRequest !== 'undefined' && typeof onProgress === "function") {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText || 'Upload successful');
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });
      
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    } else {
      // Fallback to fetch for React Native or environments without XMLHttpRequest
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          resolve(data || 'Upload successful');
        })
        .catch((error: any) => {
          const message = error?.message || 'Upload failed';
          reject(new Error(message));
        });
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
