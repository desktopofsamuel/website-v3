import querystring from 'querystring';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export class SpotifyAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpotifyAuthError';
  }
}

const getAccessToken = async () => {
  if (!client_id || !client_secret || !refresh_token) {
    throw new SpotifyAuthError(
      'Missing Spotify credentials. Set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN.'
    );
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    const description = data.error_description || data.error || 'Unknown error';
    throw new SpotifyAuthError(`Failed to refresh Spotify access token: ${description}`);
  }

  return data.access_token as string;
};

const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`;
const CURRENTLY_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=3`;

const spotifyFetch = async (url: string) => {
  const access_token = await getAccessToken();

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getTopTracks = () => spotifyFetch(TOP_TRACKS_ENDPOINT);
export const getTopArtists = () => spotifyFetch(TOP_ARTISTS_ENDPOINT);
export const getCurrentlyPlaying = () => spotifyFetch(CURRENTLY_PLAYING_ENDPOINT);
export const getRecentlyPlayed = () => spotifyFetch(RECENTLY_PLAYED_ENDPOINT);
