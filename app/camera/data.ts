export interface Photo {
  id: string;
  url: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  filmStock: string;
  date: string;
  iso: number;
  aperture: string;
  shutterSpeed: string;
}

export interface Camera {
  id: string;
  name: string;
  model: string;
  brand: string;
  image: string; // Top down view image URL
  description: string;
  photos: Photo[];
}

export const cameras: Camera[] = [
  {
    id: "leica-m6",
    name: "Leica M6",
    model: "M6",
    brand: "Leica",
    image: "https://placehold.co/600x400/222/FFF?text=Leica+M6",
    description: "The classic rangefinder camera.",
    photos: [
      {
        id: "p1",
        url: "https://placehold.co/800x1200/333/FFF?text=Photo+1",
        location: { lat: 22.3193, lng: 114.1694, name: "Mong Kok, Hong Kong" },
        filmStock: "Kodak Portra 400",
        date: "2023-10-15",
        iso: 400,
        aperture: "f/2.8",
        shutterSpeed: "1/125"
      },
      {
        id: "p2",
        url: "https://placehold.co/1200x800/444/FFF?text=Photo+2",
        location: { lat: 22.2855, lng: 114.1577, name: "Central, Hong Kong" },
        filmStock: "Kodak Portra 400",
        date: "2023-10-16",
        iso: 400,
        aperture: "f/5.6",
        shutterSpeed: "1/250"
      },
      {
        id: "p3",
        url: "https://placehold.co/800x1200/555/FFF?text=Photo+3",
        location: { lat: 22.2988, lng: 114.1722, name: "Tsim Sha Tsui, Hong Kong" },
        filmStock: "Ilford HP5",
        date: "2023-11-01",
        iso: 400,
        aperture: "f/2.0",
        shutterSpeed: "1/60"
      }
    ]
  },
  {
    id: "hasselblad-500cm",
    name: "Hasselblad 500C/M",
    model: "500C/M",
    brand: "Hasselblad",
    image: "https://placehold.co/600x400/333/FFF?text=Hasselblad+500CM",
    description: "Medium format legend.",
    photos: [
      {
        id: "h1",
        url: "https://placehold.co/1000x1000/222/FFF?text=Square+Photo+1",
        location: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
        filmStock: "Fujifilm Pro 400H",
        date: "2024-01-10",
        iso: 400,
        aperture: "f/8",
        shutterSpeed: "1/500"
      },
      {
        id: "h2",
        url: "https://placehold.co/1000x1000/333/FFF?text=Square+Photo+2",
        location: { lat: 34.6937, lng: 135.5023, name: "Osaka, Japan" },
        filmStock: "Kodak Ektar 100",
        date: "2024-01-15",
        iso: 100,
        aperture: "f/11",
        shutterSpeed: "1/125"
      }
    ]
  },
  {
    id: "contax-t2",
    name: "Contax T2",
    model: "T2",
    brand: "Contax",
    image: "https://placehold.co/600x400/444/FFF?text=Contax+T2",
    description: "Premium point and shoot.",
    photos: [
      {
        id: "c1",
        url: "https://placehold.co/800x1200/111/FFF?text=Snapshot+1",
        location: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
        filmStock: "Cinestill 800T",
        date: "2023-12-24",
        iso: 800,
        aperture: "f/2.8",
        shutterSpeed: "1/60"
      }
    ]
  }
];
