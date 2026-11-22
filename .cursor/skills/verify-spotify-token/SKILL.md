---
name: verify-spotify-token
description: "Model-check that getAccessToken posts to TOKEN_ENDPOINT at most once at a time. Use when changing lib/spotify.ts, lib/single-flight.ts, or verify/spotify-token/."
---

# Verify Spotify token refresh

At most one `fetch(TOKEN_ENDPOINT)` from `getAccessToken` may be in flight. Two overlapping `spotifyFetch` callers sharing one `tokenPromise` is required. Two overlapping POSTs can rotate or rate-limit the refresh token.

## Covered code

- `lib/single-flight.ts` `singleFlight` is `EnterGetAccessToken` when `SingleFlight = TRUE`.
- `lib/spotify.ts` `refreshAccessToken` is `TokenEndpointReturns`.
- `lib/spotify.ts` `getAccessToken` is `singleFlight(refreshAccessToken)`.
- `lib/spotify.ts` `spotifyFetch` is `UseBearer`.

Move the sync commit below only after TLC and `lib/single-flight.test.ts` still describe those functions.

Sync commit: the commit that added this skill on `encode/spotify-token`. Confirm with `git log -1 -- verify/spotify-token lib/single-flight.ts lib/spotify.ts`.

## When a change touches this

If the diff includes those files, run the check before you ship. If you change how refresh works, update the TLA+ so `EnterGetAccessToken` and `TokenEndpointReturns` stay one-to-one with the TypeScript steps, then rerun.

## Run

```sh
bash scripts/verify-spotify-token.sh
node --experimental-strip-types --test lib/single-flight.test.ts
```

The shell script downloads pinned TLC `tla2tools.jar` v1.7.4 into `verify/spotify-token/` (gitignored) and needs Java 11+.

Read every TLC result with `/statechart`. Do not copy statechart commands into this skill.

## Bounds and assumptions

- Two callers (`currentlyPlaying`, `topTracks`). Homepage widgets are four, but two is enough to show a race.
- No token cache across sequential calls. `pending` clears in `finally`, matching `singleFlight`.
- Spotify's HTTP and rotating-refresh policy are outside the model. The model only counts POSTs in flight.
- Fairness is not checked. Deadlock checking is off because `Done` stutters.

## Tell a code bug from a model bug

- TLC violates `AtMostOneTokenPost` on `SpotifyToken.cfg` (`SingleFlight = TRUE`): the model no longer matches `singleFlight`, or the TypeScript gate was removed. Diff `lib/single-flight.ts` against `EnterGetAccessToken`.
- TLC does **not** violate `AtMostOneTokenPost` on `SpotifyTokenBroken.cfg`: the broken config no longer models overlapping `fetch(TOKEN_ENDPOINT)` calls. Restore `SingleFlight = FALSE`.
- `single-flight.test.ts` fails: two overlapping callers invoked `run` more than once. That is the TypeScript bug, not TLC.

## Break it on purpose

1. In `lib/single-flight.ts`, return `run()` every time and skip `pending`. `single-flight.test.ts` must fail.
2. Drop that scratch change.
3. `SpotifyTokenBroken.cfg` keeps `SingleFlight = FALSE` so TLC still shows the old overlapping POSTs.

## Configs

- `verify/spotify-token/SpotifyTokenBroken.cfg` is the code before `singleFlight` (every `getAccessToken` posts).
- `verify/spotify-token/SpotifyToken.cfg` is the code with `singleFlight`.
