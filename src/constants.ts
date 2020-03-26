export const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
export const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
export const SPOTIFY_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: "Basic " + process.env.SPOTIFY_64
};

export const AUTH_SPOTIFY_HEADER = token => ({
  Authorization: "Bearer " + token
});

const client_credentials = {
  grant_type: "client_credentials"
};

export const SPOTIFY_BODY = Object.keys(client_credentials)
  .map(key => {
    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(client_credentials[key])
    );
  })
  .join("&");

export const venues = [
  "the independent",
  "the fillmore",
  "the fox",
  "1015 folsom",
  "the great northern",
  "the rickshaw stop",
  "the chapel"
];
