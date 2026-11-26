"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { imageUrl, type Destination } from "@/lib/destinations";

type PlaceImageResult = { image: string | null; source: string | null };

export function DestinationImage({
  destination,
  sizes,
  priority = false,
  className,
}: {
  destination: Destination;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState(() => imageUrl(destination.image, 1200));
  const [source, setSource] = useState<string | null>(null);
  const [loadPhoto, setLoadPhoto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fallback = imageUrl(destination.image, 1200);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      setLoadPhoto(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadPhoto(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadPhoto) return;
    let active = true;
    fetch(`/api/place-image/${encodeURIComponent(destination.slug)}`)
      .then((response) => response.json() as Promise<PlaceImageResult>)
      .then((result) => {
        if (!active) return;
        if (result.image) setSrc(result.image);
        setSource(result.source);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [destination.slug, loadPhoto]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Image
        src={src}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setSrc(fallback)}
        className={className}
      />
      {source && <a href={source} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 z-10 rounded bg-black/55 px-2 py-1 text-[9px] font-semibold text-white/90">Photo source</a>}
    </div>
  );
}
