import React, { useEffect } from "react";
import { useTwitter } from "./useTwitter";

const TwitterProfile = ({ apiKey, username }) => {
  const { loading, error, data, fetchUserByUsername } = useTwitter(apiKey);

  useEffect(() => {
    if (username) {
      fetchUserByUsername(username);
    }
  }, [username, fetchUserByUsername]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data ? (
        <div>
          <h2>{data.name}</h2>
          <p>@{data.username}</p>
          <p>{data.bio}</p>
        </div>
      ) : (
        <p>No user data</p>
      )}
    </div>
  );
};
