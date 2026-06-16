import AppNavBar from "@/components/AppNavBar";
import FooterReveal from "@/components/FooterReveal";

type AppLayoutProps = {
  children: React.ReactNode;
};

/** Hong Kong current temperature (Open-Meteo). Cached for 24h. */
async function fetchHongKongTemperature(): Promise<number | null> {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m";
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: { temperature_2m?: number };
    };
    const temp = data.current?.temperature_2m;
    return typeof temp === "number" ? Math.round(temp) : null;
  } catch {
    return null;
  }
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const temperature = await fetchHongKongTemperature();
  return (
    <FooterReveal>
      <AppNavBar temperature={temperature} />
      <main className="w-full">{children}</main>
    </FooterReveal>
  );
}
