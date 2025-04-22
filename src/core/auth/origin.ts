import constants from "../../constants";
import { APIError } from "../../errors";
import { uploadWithProgress } from "../../utils";

interface OriginUsageReturnType {
  user: {
    multiplier: number;
    points: number;
    active: boolean;
  };
  teams: Array<any>;
  dataSources: Array<any>;
}

/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
export class Origin {
  private jwt: string;
  constructor(jwt: string) {
    this.jwt = jwt;
  }

  #generateURL = async (file: File) => {
    const uploadRes = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/upload-url`,
      {
        method: "POST",
        body: JSON.stringify({
          name: file.name,
          type: file.type,
        }),
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      }
    );
    const data = await uploadRes.json();
    return data.isError ? data.message : data.data;
  };

  #setOriginStatus = async (key: string, status: string) => {
    const res = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/update-status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
          fileKey: key,
        }),
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      console.error("Failed to update origin status");
      return;
    }
  };

  uploadFile = async (
    file: File,
    options?: { progressCallback?: (percent: number) => void }
  ) => {
    const uploadURL = await this.#generateURL(file);
    if (!uploadURL) {
      console.error("Failed to generate upload URL");
      return;
    }
    try {
      await uploadWithProgress(
        file,
        uploadURL.url,
        options?.progressCallback || (() => {})
      );
    } catch (error) {
      await this.#setOriginStatus(uploadURL.key, "failed");
      throw new Error("Failed to upload file: " + error);
    }
    await this.#setOriginStatus(uploadURL.key, "success");
  };

  getOriginUploads = async () => {
    const res = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/files`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
      }
    );
    if (!res.ok) {
      console.error("Failed to get origin uploads");
      return null;
    }
    const data = await res.json();
    return data.data;
  };

  /**
   * Get the user's Origin stats (multiplier, consent, usage, etc.).
   * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
   */

  async getOriginUsage(): Promise<OriginUsageReturnType> {
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/usage`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (!data.isError && data.data.user) {
      return data;
    } else {
      throw new APIError(data.message || "Failed to fetch Origin usage");
    }
  }

  /**
   * Set the user's consent for Origin usage.
   * @param {boolean} consent The user's consent.
   * @returns {Promise<void>}
   * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
   */

  async setOriginConsent(consent: boolean): Promise<void> {
    if (consent === undefined) {
      throw new APIError("Consent is required");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: consent,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return;
    } else {
      throw new APIError(data.message || "Failed to set Origin consent");
    }
  }

  /**
   * Set the user's Origin multiplier.
   * @param {number} multiplier The user's Origin multiplier.
   * @returns {Promise<void>}
   * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
   */

  async setOriginMultiplier(multiplier: number): Promise<void> {
    if (multiplier === undefined) {
      throw new APIError("Multiplier is required");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/origin/multiplier`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          // "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          multiplier,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return;
    } else {
      throw new APIError(data.message || "Failed to set Origin multiplier");
    }
  }
}
