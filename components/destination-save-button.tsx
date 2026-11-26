"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";

export function DestinationSaveButton({ slug }: { slug: string }) {
  const { favorites, toggleFavorite } = useFavorites();
  const saved = favorites.includes(slug);
  return (
    <button type="button" aria-pressed={saved} onClick={() => toggleFavorite(slug)} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/55 bg-black/10 px-5 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/15">
      <Heart size={15} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save place"}
    </button>
  );
}
