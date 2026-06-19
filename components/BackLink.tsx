"use client";

import { useRouter } from "next/navigation";

type BackLinkProps = {
  /** Fallback route used when there is no in-app history to go back to. */
  fallbackHref: string;
  className?: string;
  children: React.ReactNode;
};

export default function BackLink({
  fallbackHref,
  className,
  children,
}: BackLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
