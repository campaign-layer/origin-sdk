/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */

import constants from "../../constants";
import { uploadWithProgress } from "../../utils";

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
}
