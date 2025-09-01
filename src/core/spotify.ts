import { fetchData, buildURL, baseSpotifyURL as baseURL } from "../utils";
import { APIError, ValidationError } from "../errors";

interface SpotifyAPIOptions {
  apiKey: string;
}

/**
 * The SpotifyAPI class.
 * @class
 */
class SpotifyAPI {
  apiKey: string;

  /**
   * Constructor for the SpotifyAPI class.
   * @constructor
   * @param {SpotifyAPIOptions} options - The Spotify API options.
   * @param {string} options.apiKey - The Spotify API key.
   * @throws {Error} - Throws an error if the API key is not provided.
   */
  constructor(options: SpotifyAPIOptions) {
    if (!options || !options.apiKey || typeof options.apiKey !== 'string' || options.apiKey.trim() === '') {
      throw new ValidationError("API key is required and must be a non-empty string");
    }
    this.apiKey = options.apiKey.trim();
  }

  /**
   * Fetch the user's saved tracks by Spotify user ID.
   * @param {string} spotifyId - The user's Spotify ID.
   * @returns {Promise<object>} - The saved tracks.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchSavedTracksById(spotifyId: string): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/save-tracks`, {
      spotifyId: spotifyId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the played tracks of a user by Spotify ID.
   * @param {string} spotifyId - The user's Spotify ID.
   * @returns {Promise<object>} - The played tracks.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchPlayedTracksById(spotifyId: string): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/played-tracks`, {
      spotifyId: spotifyId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the user's saved albums by Spotify user ID.
   * @param {string} spotifyId - The user's Spotify ID.
   * @returns {Promise<object>} - The saved albums.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchSavedAlbumsById(spotifyId: string): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/saved-albums`, {
      spotifyId: spotifyId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the user's saved playlists by Spotify user ID.
   * @param {string} spotifyId - The user's Spotify ID.
   * @returns {Promise<object>} - The saved playlists.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchSavedPlaylistsById(spotifyId: string): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/saved-playlists`, {
      spotifyId: spotifyId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the tracks of an album by album ID.
   * @param {string} spotifyId - The Spotify ID of the user.
   * @param {string} albumId - The album ID.
   * @returns {Promise<object>} - The tracks in the album.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchTracksInAlbum(
    spotifyId: string,
    albumId: string
  ): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    if (!albumId || typeof albumId !== 'string' || albumId.trim() === '') {
      throw new ValidationError("Album ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/album/tracks`, {
      spotifyId: spotifyId.trim(),
      albumId: albumId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the tracks in a playlist by playlist ID.
   * @param {string} spotifyId - The Spotify ID of the user.
   * @param {string} playlistId - The playlist ID.
   * @returns {Promise<object>} - The tracks in the playlist.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchTracksInPlaylist(
    spotifyId: string,
    playlistId: string
  ): Promise<object> {
    if (!spotifyId || typeof spotifyId !== 'string' || spotifyId.trim() === '') {
      throw new ValidationError("Spotify ID is required and must be a non-empty string");
    }
    if (!playlistId || typeof playlistId !== 'string' || playlistId.trim() === '') {
      throw new ValidationError("Playlist ID is required and must be a non-empty string");
    }
    const url = buildURL(`${baseURL}/playlist/tracks`, {
      spotifyId: spotifyId.trim(),
      playlistId: playlistId.trim(),
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch the user's Spotify data by wallet address.
   * @param {string} walletAddress - The wallet address.
   * @returns {Promise<object>} - The user's Spotify data.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchUserByWalletAddress(walletAddress: string): Promise<object> {
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      throw new ValidationError("Wallet address is required and must be a non-empty string");
    }
    // Basic evm address format validation
    const trimmedAddress = walletAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
      throw new ValidationError("Invalid wallet address format");
    }
    const url = buildURL(`${baseURL}/wallet-spotify-data`, { walletAddress: trimmedAddress });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Private method to fetch data with authorization header.
   * @param {string} url - The URL to fetch.
   * @returns {Promise<object>} - The response data.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async _fetchDataWithAuth(url: string): Promise<object> {
    if (!this.apiKey) {
      throw new APIError("API key is required for fetching data", 401);
    }
    try {
      return await fetchData(url, { "x-api-key": this.apiKey });
    } catch (error: any) {
      throw new APIError(error.message, error.statusCode);
    }
  }
}

export { SpotifyAPI };
