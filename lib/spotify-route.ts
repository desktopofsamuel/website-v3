import { NextResponse } from "next/server";
import { SpotifyAuthError } from "@/lib/spotify";

type SpotifyRouteOptions<T> = {
  label: string;
  request: () => Promise<Response>;
  parse: (data: unknown) => T | null;
  fallback: T;
  cacheControl?: string;
};

export async function createSpotifyResponse<T>({
  label,
  request,
  parse,
  fallback,
  cacheControl,
}: SpotifyRouteOptions<T>) {
  try {
    const response = await request();

    if (!response.ok) {
      const error = await response.text();
      console.error(`${label} Spotify API error (${response.status}):`, error);
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const payload = parse(data) ?? fallback;

    return NextResponse.json(payload, {
      headers: cacheControl ? { "Cache-Control": cacheControl } : undefined,
    });
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      console.error(`${label} auth error:`, error.message);
    } else {
      console.error(`${label} API error:`, error);
    }

    return NextResponse.json(fallback);
  }
}
