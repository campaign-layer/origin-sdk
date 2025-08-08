'use strict';

var tslib_es6 = require('../../node_modules/tslib/tslib.es6.js');
var utils = require('../utils.js');
var errors = require('../errors.js');

/**
 * The SpotifyAPI class.
 * @class
 */
class SpotifyAPI {
    /**
     * Constructor for the SpotifyAPI class.
     * @constructor
     * @param {SpotifyAPIOptions} options - The Spotify API options.
     * @param {string} options.apiKey - The Spotify API key.
     * @throws {Error} - Throws an error if the API key is not provided.
     */
    constructor(options) {
        this.apiKey = options.apiKey;
    }
    /**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedTracksById(spotifyId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/save-tracks`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchPlayedTracksById(spotifyId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/played-tracks`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedAlbumsById(spotifyId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/saved-albums`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedPlaylistsById(spotifyId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/saved-playlists`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInAlbum(spotifyId, albumId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/album/tracks`, {
                spotifyId,
                albumId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInPlaylist(spotifyId, playlistId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/playlist/tracks`, {
                spotifyId,
                playlistId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseSpotifyURL}/wallet-spotify-data`, { walletAddress });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new errors.APIError("API key is required for fetching data", 401);
            }
            try {
                return yield utils.fetchData(url, { "x-api-key": this.apiKey });
            }
            catch (error) {
                throw new errors.APIError(error.message, error.statusCode);
            }
        });
    }
}

exports.SpotifyAPI = SpotifyAPI;
