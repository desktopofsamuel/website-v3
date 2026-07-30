#!/usr/bin/env node

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const SCOPES = [
  'user-top-read',
  'user-read-currently-playing',
  'user-read-recently-played',
].join(' ');

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const PORT = 8888;

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) {
    console.error('Missing .env.local file');
    process.exit(1);
  }

  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=').replace(/^["']|["']$/g, '');
  }
  return env;
}

const env = loadEnv();
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local');
  process.exit(1);
}

const state = randomBytes(16).toString('hex');
const authUrl = new URL('https://accounts.spotify.com/authorize');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', clientId);
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('show_dialog', 'true');

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
    console.error(`Authorization failed: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code || returnedState !== state) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h1>Invalid callback</h1><p>Missing code or state mismatch.</p>');
    console.error('Invalid callback: missing code or state mismatch');
    server.close();
    process.exit(1);
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok || !tokens.refresh_token) {
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>Token exchange failed</h1>');
    console.error('Token exchange failed:', tokens);
    server.close();
    process.exit(1);
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Success</h1><p>Check your terminal for the new refresh token.</p>');

  console.log('\nAuthorization successful.\n');
  console.log('Update SPOTIFY_REFRESH_TOKEN in .env.local with:\n');
  console.log(tokens.refresh_token);
  console.log('\nRestart your dev server after updating the token.\n');

  server.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log('\nSpotify authorization');
  console.log('Add http://127.0.0.1:8888/callback to your app redirect URIs, then open:\n');
  console.log(authUrl.toString());
  console.log('\nWaiting for callback on port 8888...\n');
});
