const { SpotifyAPI } = require('../dist/core.cjs');
const { APIError } = require('../dist/core.cjs');

describe('SpotifyAPI', () => {
  let spotifyAPI;
  const apiKey = 'test-api-key';
  const spotifyId = 'test-spotify-id';
  const walletAddress = '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    spotifyAPI = new SpotifyAPI({ apiKey });
  });

  test('should fetch saved tracks by Spotify ID', async () => {
    const mockResponse = { tracks: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchSavedTracksById(spotifyId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('save-tracks'));
  });

  test('should fetch played tracks by Spotify ID', async () => {
    const mockResponse = { tracks: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchPlayedTracksById(spotifyId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('played-tracks'));
  });

  test('should fetch saved albums by Spotify ID', async () => {
    const mockResponse = { albums: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchSavedAlbumsById(spotifyId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('saved-albums'));
  });

  test('should fetch saved playlists by Spotify ID', async () => {
    const mockResponse = { playlists: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchSavedPlaylistsById(spotifyId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('saved-playlists'));
  });

  test('should fetch tracks in an album by album ID', async () => {
    const albumId = 'test-album-id';
    const mockResponse = { tracks: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchTracksInAlbum(spotifyId, albumId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('album/tracks'));
  });

  test('should fetch tracks in a playlist by playlist ID', async () => {
    const playlistId = 'test-playlist-id';
    const mockResponse = { tracks: [] };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchTracksInPlaylist(spotifyId, playlistId);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('playlist/tracks'));
  });

  test('should fetch user by wallet address', async () => {
    const mockResponse = { user: {} };
    jest.spyOn(spotifyAPI, '_fetchDataWithAuth').mockResolvedValue(mockResponse);

    const response = await spotifyAPI.fetchUserByWalletAddress(walletAddress);
    expect(response).toEqual(mockResponse);
    expect(spotifyAPI._fetchDataWithAuth).toHaveBeenCalledWith(expect.stringContaining('wallet-spotify-data'));
  });

  test('should throw an error if API key is missing', async () => {
    spotifyAPI.apiKey = null;
    await expect(spotifyAPI.fetchSavedTracksById(spotifyId)).rejects.toThrow(APIError);
  });
});
