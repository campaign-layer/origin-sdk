const { SpotifyAPI, TwitterAPI } = require('../dist/core.cjs');
const { ValidationError } = require('../dist/core.cjs');

describe('Input Validation', () => {
  describe('SpotifyAPI Validation', () => {
    test('should throw ValidationError for empty API key', () => {
      expect(() => new SpotifyAPI({ apiKey: '' })).toThrow(ValidationError);
      expect(() => new SpotifyAPI({ apiKey: '   ' })).toThrow(ValidationError);
    });

    test('should throw ValidationError for missing spotifyId', async () => {
      const spotify = new SpotifyAPI({ apiKey: 'test-key' });
      await expect(spotify.fetchSavedTracksById('')).rejects.toThrow(ValidationError);
      await expect(spotify.fetchSavedTracksById('   ')).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid wallet address', async () => {
  const spotify = new SpotifyAPI({ apiKey: 'test-key' });
  await expect(spotify.fetchUserByWalletAddress('invalid-address')).rejects.toThrow(ValidationError);
  await expect(spotify.fetchUserByWalletAddress('0x123')).rejects.toThrow(ValidationError);
  // Mock API call for valid address
  jest.spyOn(spotify, '_fetchDataWithAuth').mockResolvedValue({});
  await expect(spotify.fetchUserByWalletAddress('0x1234567890abcdef1234567890abcdef12345678')).resolves.not.toThrow();
    });
  });

  describe('TwitterAPI Validation', () => {
    test('should throw ValidationError for empty API key', () => {
      expect(() => new TwitterAPI({ apiKey: '' })).toThrow(ValidationError);
      expect(() => new TwitterAPI({ apiKey: '   ' })).toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid Twitter username', async () => {
      const twitter = new TwitterAPI({ apiKey: 'test-key' });
      await expect(twitter.fetchUserByUsername('')).rejects.toThrow(ValidationError);
      await expect(twitter.fetchUserByUsername('invalid-username-too-long')).rejects.toThrow(ValidationError);
      await expect(twitter.fetchUserByUsername('invalid@username')).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid tweet ID', async () => {
      const twitter = new TwitterAPI({ apiKey: 'test-key' });
      await expect(twitter.fetchTweetById('')).rejects.toThrow(ValidationError);
      await expect(twitter.fetchTweetById('invalid-tweet-id')).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid page/limit parameters', async () => {
      const twitter = new TwitterAPI({ apiKey: 'test-key' });
      await expect(twitter.fetchTweetsByUsername('valid_user', 0, 10)).rejects.toThrow(ValidationError);
      await expect(twitter.fetchTweetsByUsername('valid_user', 1, 0)).rejects.toThrow(ValidationError);
      await expect(twitter.fetchTweetsByUsername('valid_user', 1, 101)).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid wallet address', async () => {
  const twitter = new TwitterAPI({ apiKey: 'test-key' });
  await expect(twitter.fetchUserByWalletAddress('invalid-address')).rejects.toThrow(ValidationError);
  await expect(twitter.fetchUserByWalletAddress('0x123')).rejects.toThrow(ValidationError);
  // Mock API call for valid address
  jest.spyOn(twitter, '_fetchDataWithAuth').mockResolvedValue({});
  await expect(twitter.fetchUserByWalletAddress('0x1234567890abcdef1234567890abcdef12345678')).resolves.not.toThrow();
    });
  });
});
