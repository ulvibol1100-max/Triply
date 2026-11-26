"use client";

import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useFavorites } from "@/components/favorites-provider";
import type { Destination } from "@/lib/destinations";
import { DestinationImage } from "@/components/destination-image";

export function DestinationCard({
  destination,
  index = 0,
  variant = "grid",
}: {
  destination: Destination;
  index?: number;
  variant?: "grid" | "list";
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const saved = favorites.includes(destination.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className={`group ${variant === "list" ? "grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center" : ""}`}
    >
      <div className={`image-wrap relative overflow-hidden rounded-[4px] bg-[#e8ebe6] ${variant === "list" ? "aspect-[1.25]" : "aspect-[.88]"}`}>
        <DestinationImage
          destination={destination}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/5" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#345247]">
          {destination.category}
        </span>
        <button
          type="button"
          aria-label={saved ? `Remove ${destination.name} from saved places` : `Save ${destination.name}`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(destination.slug)}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink transition hover:scale-105 hover:bg-white"
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} className={saved ? "text-[#d36e59]" : ""} />
        </button>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[.16em] text-white/80">{destination.country}</p>
            <h3 className="editorial text-4xl leading-none">{destination.name}</h3>
          </div>
          <span className="mb-0.5 text-sm text-white/90">From ${destination.budget} / day</span>
        </div>
      </div>
      <div className={`flex items-start justify-between gap-5 ${variant === "list" ? "pt-1" : "pt-4"}`}>
        <p className="max-w-[31ch] text-[15px] leading-7 text-[#65756f]">{destination.description}</p>
        <Link
          href={`/destinations/${destination.slug}`}
          aria-label={`Explore ${destination.name}`}
          className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-[#dfe4dd] transition group-hover:border-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white"
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
