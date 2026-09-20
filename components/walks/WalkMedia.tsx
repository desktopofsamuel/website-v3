type WalkMediaProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function WalkMedia({ src, alt, className = "" }: WalkMediaProps) {
  return (
    // SVGs stay out of next/image; missing files show the gray parent box.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
