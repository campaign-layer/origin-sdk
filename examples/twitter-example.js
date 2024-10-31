import React, { useEffect } from "react";
import { useGetUserByUsername } from "camp-sdk/react/twitter";

const TwitterProfile = ({ username }) => {
  const { data, error, isLoading } = useGetUserByUsername(username);

  if (isLoading) return <p>Loading...</p>;
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
