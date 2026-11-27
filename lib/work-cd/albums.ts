export type DummyAlbum = {
  id: string;
  title: string;
  sub: string;
  year: string;
  a: string;
  b: string;
  ink: string;
  tracks: string[];
  coverUrl?: string;
};

export const DUMMY_ALBUMS: DummyAlbum[] = [
  {
    id: "joysip",
    title: "JoySip",
    sub: "Joyful Moments in Every Sip",
    year: "2026",
    a: "#e5391a",
    b: "#f6efe4",
    ink: "#ffffff",
    tracks: ["Sip", "Bowl", "Kitchen", "Moment"],
    coverUrl: "/dev/work-cd/joysip.png",
  },
  {
    id: "wff",
    title: "Water For Free",
    sub: "Hong Kong",
    year: "2019",
    a: "#7ee3ff",
    b: "#0176c2",
    ink: "#05314d",
    tracks: ["Harbour Walk", "Tap Filter", "Kowloon Night", "Refill"],
  },
  {
    id: "okx",
    title: "BETH Shark Fin",
    sub: "OKX Earn",
    year: "2022",
    a: "#1d262e",
    b: "#c9a227",
    ink: "#f4e7c3",
    tracks: ["Strike", "Coupon", "Expiry", "Settle"],
  },
  {
    id: "hsbc",
    title: "HSBC Stocks",
    sub: "Protiviti",
    year: "2018",
    a: "#1a1a1a",
    b: "#db0011",
    ink: "#fff5f5",
    tracks: ["Watchlist", "Order Ticket", "Fill", "Close"],
  },
  {
    id: "fx",
    title: "HyperAir FX",
    sub: "Currency",
    year: "2020",
    a: "#0176ee",
    b: "#9fd0ff",
    ink: "#041428",
    tracks: ["Quote", "Spread", "Book", "Receipt"],
  },
];
