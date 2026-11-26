import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { imageUrl } from "@/lib/destinations";

export function AccountGate({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  return (
    <main className="grid min-h-[calc(100vh-76px)] bg-[#f7f6f1] lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden min-h-[700px] overflow-hidden bg-[#29443a] lg:block">
        <Image src={imageUrl("photo-1516483638261-f4dbaf036963", 1600)} alt="A sunlit coastal village on the Italian Riviera" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101e19]/70 via-transparent to-[#101e19]/10" />
        <div className="absolute bottom-12 left-12 max-w-[500px] text-white">
          <p className="eyebrow !text-[#f0c98e]">Good things are out there</p>
          <p className="editorial mt-4 text-5xl leading-tight">A little more wonder in the way you travel.</p>
          <p className="mt-4 text-xs text-white/75">Discover more. Plan better. Travel further.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-24 lg:px-14">
        <div className="w-full max-w-[430px]">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#65756f] transition hover:text-[#2563eb]"><ArrowLeft size={14} /> Back to Triply</Link>
          <div className="mt-14">
            <p className="eyebrow mb-4">Your next chapter</p>
            <h1 className="editorial text-5xl tracking-[-.035em]">{isRegister ? "Make room for" : "Welcome back to"}<br /><em className="font-normal text-[#789185]">{isRegister ? "somewhere new." : "the journey."}</em></h1>
            <p className="mt-5 max-w-[360px] text-[13px] leading-6 text-[#65756f]">Triply’s private trip accounts are not connected in this preview yet. You can explore destinations and save places on this device in the meantime.</p>
          </div>
          <div className="mt-8 flex gap-3 border border-[#dfe4dd] bg-white/70 p-4">
            <LockKeyhole size={17} className="mt-0.5 shrink-0 text-[#789185]" />
            <p className="text-[11px] leading-5 text-[#65756f]">No account details are collected or submitted from this preview.</p>
          </div>
          <Link href="/explore" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2563eb] px-6 text-[11px] font-extrabold text-white transition hover:bg-[#1d4ed8]">Explore as a guest <ArrowUpRight size={15} /></Link>
          <p className="mt-8 text-[11px] text-[#78847e]">{isRegister ? "Already have an account?" : "New to Triply?"} <Link href={isRegister ? "/login" : "/register"} className="font-extrabold text-[#2563eb] underline decoration-[#bdc9c0] underline-offset-4">{isRegister ? "Sign in" : "Create an account"}</Link></p>
        </div>
      </div>
    </main>
  );
}
