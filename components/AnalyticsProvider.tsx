"use client";

import dynamic from "next/dynamic";

const Analytics = dynamic(
  () => import("@vercel/analytics/next").then((m) => ({ default: m.Analytics })),
  { ssr: false }
);

const GoogleAnalytics = dynamic(
  () =>
    import("@next/third-parties/google").then((m) => ({
      default: m.GoogleAnalytics,
    })),
  { ssr: false }
);

type AnalyticsProviderProps = {
  gaId: string;
};

export default function AnalyticsProvider({ gaId }: AnalyticsProviderProps) {
  return (
    <>
      <Analytics />
      <GoogleAnalytics gaId={gaId} />
    </>
  );
}
