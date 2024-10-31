import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { CampContext } from "../context/CampContext.jsx";

/**
 * Get X user by username.
 * @param {string} - The Twitter username.
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */
export const useGetUserByUsername = (twitterUsername) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["x-user", twitterUsername],
    queryFn: () => twitter.fetchUserByUsername(twitterUsername),
  });
};

/**
 * Get tweets by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetTweetsByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["tweets", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchTweetsByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get followers by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetFollowersByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["x-followers", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchFollowersByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get following by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetFollowingByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["x-following", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchFollowingByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get tweet by ID.
 * @param {string} tweetId - The tweet ID.
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetTweetById = (tweetId) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["tweet", tweetId],
    queryFn: () => twitter.fetchTweetById(tweetId),
  });
};

/**
 * Get user by wallet address.
 * @param {string} walletAddress - The wallet address.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetUserByWalletAddress = (
  walletAddress,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["user", walletAddress, options.page, options.limit],
    queryFn: () =>
      twitter.fetchUserByWalletAddress(
        walletAddress,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get reposted by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetRepostedByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["reposted", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchRepostedByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get replies by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetRepliesByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["replies", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchRepliesByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get liked tweets by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetLikesByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["x-likes", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchLikesByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get followed accounts by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetFollowsByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["x-follows", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchFollowsByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

/**
 * Get viewed tweets by username.
 * @param {string} twitterUserName - The Twitter username.
 * @param {object} options - { page: number, limit: number }
 * @returns {object} - useQuery object.
 * @throws {APIError} - Throws an error if the request fails.
 */

export const useGetViewedTweetsByUsername = (
  twitterUsername,
  options = { page: 1, limit: 10 }
) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["viewedTweets", twitterUsername, options.page, options.limit],
    queryFn: () =>
      twitter.fetchViewedTweetsByUsername(
        twitterUsername,
        options.page,
        options.limit
      ),
  });
};

export const useTwitterAPI = () => {
  const { twitter } = useContext(CampContext);
  return twitter;
};
