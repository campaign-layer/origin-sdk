import { useQuery } from "@tanstack/react-query";
import { useContext } from 'react'
import { TwitterAPI } from "../../twitter.js";
import { CampContext } from "../index.js";

export const useGetUserByUsername = (twitterUsername) => {
  const { twitter } = useContext(CampContext);
  return useQuery({
    queryKey: ["user", twitterUsername],
    queryFn: () => twitter.fetchUserByUsername(twitterUsername),
  })
}


export const useTwitter = () => {
  const getUserByUsername = (twitterUsername) => {
    return TwitterAPI.getUserByUsername(twitterUsername, { apiKey });
  };

  const getTweetsByUsername = (twitterUsername, options) => {
    return TwitterAPI.getTweetsByUsername(twitterUsername, { ...options, apiKey });
  };

  const getFollowersByUsername = (twitterUsername, options) => {
    return TwitterAPI.getFollowersByUsername(twitterUsername, { ...options, apiKey });
  };

  const getFollowingByUsername = (twitterUsername, options) => {
    return TwitterAPI.getFollowingByUsername(twitterUsername, { ...options, apiKey });
  };

  const getTweetById = (tweetId) => {
    return TwitterAPI.getTweetById(tweetId, { apiKey });
  };

  return {
    getUserByUsername: (twitterUsername) => {
      return useQuery(["user", twitterUsername], () =>
        getUserByUsername(twitterUsername)
      );
    },
    getTweetsByUsername: (
      twitterUsername,
      options = { page: 1, limit: 10 }
    ) => {
      return useQuery(
        ["tweets", twitterUsername, options.page, options.limit],
        () => getTweetsByUsername(twitterUsername, options),
        {
          keepPreviousData: true,
        }
      );
    },
    getFollowersByUsername: (
      twitterUsername,
      options = { page: 1, limit: 10 }
    ) => {
      return useQuery(
        ["followers", twitterUsername, options.page, options.limit],
        () => getFollowersByUsername(twitterUsername, options),
        {
          keepPreviousData: true,
        }
      );
    },
    getFollowingByUsername: (
      twitterUsername,
      options = { page: 1, limit: 10 }
    ) => {
      return useQuery(
        ["following", twitterUsername, options.page, options.limit],
        () => getFollowingByUsername(twitterUsername, options),
        {
          keepPreviousData: true,
        }
      );
    },
    getTweetById: (tweetId) => {
      return useQuery(["tweet", tweetId], () => getTweetById(tweetId));
    },
  };
};
