import fetch from "node-fetch";
import {
  AUTH_SPOTIFY_HEADER,
  SPOTIFY_TOKEN_URL,
  SPOTIFY_HEADER,
  SPOTIFY_BODY,
  SPOTIFY_SEARCH_URL,
  venues
} from "./constants";
import { getRepository } from "typeorm";
import { Artists } from "./entity/Artist";

let currentToken = "";

export const setToken = async () => {
  currentToken = await getToken();
};

export const getToken = async () => {
  const result = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: SPOTIFY_HEADER,
    body: SPOTIFY_BODY
  }).then(r => r.json());
  return result.access_token;
};

export const search = async (artist: string) => {
  // if this fails get a new token and search again
  const result = await fetch(
    SPOTIFY_SEARCH_URL + "?q=" + artist + "&type=artist",
    {
      method: "GET",
      headers: AUTH_SPOTIFY_HEADER(currentToken)
    }
  ).then(r => r.json());
  return result;
};

export const randomVenue = () => {
  return venues[Math.floor(Math.random() * venues.length)];
};

export const randomArtist = async () => {
  const artistRepo = getRepository(Artists);
  const artists = await artistRepo.find();
  return artists[Math.floor(Math.random() * artists.length)];
};

export const getLastArtist = async () => {
  const artistRepo = getRepository(Artists);
  const artist = await artistRepo.findOne({ order: { id: "DESC" } });
  return artist;
};

export const addDays = function(d, days) {
  var date = new Date(d.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export const timeDiffMins = (showDate: Date) => {
  const currentTime = new Date();
  const timeDiff = (currentTime as any) - (showDate as any);
  return timeDiff / 1000 / 60;
};
