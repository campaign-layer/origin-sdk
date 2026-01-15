// @ts-ignore-line
import axios from "axios";
import { APIError } from "./errors";
import constants from "./constants";

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

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;

interface UploadProgressCallback {
  (percent: number): void;
}

interface UploadWithProgress {
  (chunks: Blob[], urls: string[], onProgress: UploadProgressCallback): Promise<
    UploadPartResult[]
  >;
}

export interface UploadPartResult {
  ETag: string;
  PartNumber: number;
}

/**
 * Uploads chunks to respective presigned URLs with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {Blob[]} chunks - The file to upload.
 * @param {string[]} urls - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
export const uploadWithProgress: UploadWithProgress = (
  chunks,
  urls,
  onProgress
) => {
  const MAX_RETRIES = 3;
  const CONCURRENCY_LIMIT = 4; // Parallel uploads for performance
  const parts: UploadPartResult[] = [];
  let failedParts: number[] = [];
  let isAborted = false;
  let completedChunks = 0;
  const totalChunks = chunks.length;

  return new Promise<UploadPartResult[]>((resolve, reject) => {
    function updateProgress() {
      const progress = (completedChunks / totalChunks) * 100;
      onProgress(progress);
    }

    async function uploadPart(
      blob: Blob,
      url: string,
      partNumber: number,
      retryCount = 0
    ): Promise<UploadPartResult> {
      try {
        const response = await axios.put(url, blob, {
          headers: { "Content-Type": blob.type || "application/octet-stream" },
          timeout: 300000, // 5 minutes per part
        });

        const etag = response.headers.etag?.replace(/"/g, "");
        if (!etag) {
          throw new Error(`Missing ETag for part ${partNumber}`);
        }

        return { ETag: etag, PartNumber: partNumber };
      } catch (error: any) {
        if (retryCount < MAX_RETRIES) {
          const delay = 1000 * Math.pow(2, retryCount); // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return uploadPart(blob, url, partNumber, retryCount + 1);
        }

        throw new Error(
          `Part ${partNumber} failed after ${MAX_RETRIES} retries: ${error.message}`
        );
      }
    }

    async function uploadAllParts() {
      const uploadPromises: Promise<void>[] = [];

      for (let i = 0; i < totalChunks; i++) {
        if (isAborted) break;

        const uploadPromise = (async () => {
          try {
            if (failedParts.includes(i)) return;

            const result = await uploadPart(chunks[i], urls[i], i + 1);
            parts.push(result);
            completedChunks++;
            updateProgress();
          } catch (error: any) {
            console.error(`Part ${i + 1} failed:`, error);
            failedParts.push(i);
            if (failedParts.length > totalChunks * 0.1) {
              // Fail fast if >10% fail
              throw error;
            }
          }
        })();

        uploadPromises.push(uploadPromise);

        // Limit concurrency
        if (uploadPromises.length >= CONCURRENCY_LIMIT) {
          await Promise.race(uploadPromises);
          // Remove settled promises to continue
          uploadPromises.splice(
            0,
            uploadPromises.length,
            ...(await Promise.allSettled(uploadPromises))
              .map((_, idx) => uploadPromises[idx] as Promise<void>)
              .filter(Boolean)
          );
        }
      }

      await Promise.allSettled(uploadPromises);

      if (isAborted) {
        reject(new Error("Upload aborted by user"));
        return;
      }

      if (failedParts.length > 0) {
        reject(
          new Error(
            `Failed to upload ${
              failedParts.length
            }/${totalChunks} parts: ${failedParts.join(", ")}`
          )
        );
        return;
      }

      parts.sort((a, b) => a.PartNumber - b.PartNumber);

      resolve(parts);
    }

    // Expose abort method
    (uploadWithProgress as any).abort = () => {
      isAborted = true;
      axios.isCancel("Upload aborted");
    };

    updateProgress(); // Initial 0%
    uploadAllParts().catch(reject);
  });
};

export const toSeconds = (
  duration: number | "",
  licenseDurationUnit: string
): number => {
  if (duration === "") return 0;

  const durationInSeconds =
    licenseDurationUnit === "hours"
      ? Number(duration) * SECONDS_IN_HOUR
      : licenseDurationUnit === "days"
      ? Number(duration) * SECONDS_IN_DAY
      : licenseDurationUnit === "weeks"
      ? Number(duration) * SECONDS_IN_WEEK
      : Number(duration);

  return durationInSeconds;
};

/**
 * Validates if the given price string represents a valid price in wei.
 * The price must be a non-empty string that, when converted to wei, is at least the minimum price defined in constants.
 * @param {string} price - The price string to validate (in CAMP).
 * @returns {boolean} - True if the price is valid, false otherwise.
 */
export const validatePrice = (price: string) => {
  if (price && price.trim() !== "") {
    const priceInWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, 18)));
    return priceInWei >= BigInt(constants.MIN_PRICE);
  } else {
    return false;
  }
};

/**
 * Validates if the given duration is within the allowed license duration range.
 * The duration must be a number and, when converted to seconds, must be between the minimum and maximum license duration defined in constants.
 * @param {number | ""} duration - The duration to validate.
 * @param {string} licenseDurationUnit - The unit of the duration (e.g., "hours", "days", "weeks").
 * @returns {boolean} - True if the duration is valid, false otherwise.
 */
export const validateDuration = (
  duration: number | "",
  licenseDurationUnit: string
) => {
  let isValid = duration !== "" && !isNaN(Number(duration));
  if (isValid) {
    const durationInSeconds =
      licenseDurationUnit === "hours"
        ? Number(duration) * SECONDS_IN_HOUR
        : licenseDurationUnit === "days"
        ? Number(duration) * SECONDS_IN_DAY
        : licenseDurationUnit === "weeks"
        ? Number(duration) * SECONDS_IN_WEEK
        : Number(duration);
    isValid =
      durationInSeconds <= constants.MAX_LICENSE_DURATION &&
      durationInSeconds >= constants.MIN_LICENSE_DURATION;
  }
  return isValid;
};

export const validateRoyaltyBps = (royaltyBps: string) => {
  if (royaltyBps && royaltyBps.trim() !== "") {
    const bps = Math.floor(parseFloat(royaltyBps) * 100);
    return bps >= constants.MIN_ROYALTY_BPS && bps <= constants.MAX_ROYALTY_BPS;
  } else {
    return false;
  }
};

export const splitFileIntoChunks = (file: File, chunkSize: number): Blob[] => {
  const chunks: Blob[] = [];
  let start = 0;
  while (start < file.size) {
    chunks.push(file.slice(start, start + chunkSize));
    start += chunkSize;
  }
  return chunks;
};

export { fetchData, buildQueryString, buildURL, formatAddress, capitalize };
