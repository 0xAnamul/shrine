import Link from "next/link";
import { BadgeCheck, Gamepad2, ArrowLeftRight, Sparkles } from "lucide-react";
import { SHRINE_TOKEN } from "@/lib/contracts";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="py-16 text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-mono tracking-tighter">
          play. swap. mint.
        </h1>
        <p className="text-ritual-muted max-w-xl mx-auto">
          A points-driven dApp playground on the Ritual Testnet.
        </p>

        {/* Verified token banner */}
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full
                        border border-ritual-border bg-ritual-surface text-sm">
          <span className="text-ritual-muted">Powered by</span>
          <span className="font-semibold text-ritual-fg">{SHRINE_TOKEN.symbol}</span>
          {SHRINE_TOKEN.verified && (
            <BadgeCheck size={16} className="text-ritual-verified" />
          )}
          <code className="text-xs text-ritual-muted">
            {SHRINE_TOKEN.address.slice(0, 6)}…{SHRINE_TOKEN.address.slice(-4)}
          </code>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Card href="/snake" icon={<Gamepad2 />} title="Snake"
              desc="Earn points by playing the classic snake game." />
        <Card href="/swap" icon={<ArrowLeftRight />} title="Swap"
              desc="+100 points for every successful SHRINE swap." />
        <Card href="/mint" icon={<Sparkles />} title="Mint"
              desc="Spend your points to mint exclusive Ritual NFTs." />
        <Card href="#community" icon={<BadgeCheck />} title="Community"
              desc="Join us on X and Discord." />
      </section>
    </div>
  );
}

function Card({ href, icon, title, desc }: any) {
  return (
    <Link href={href}
      className="group p-6 rounded-xl border border-ritual-border bg-ritual-surface
                 hover:border-ritual-accent transition-colors">
      <div className="flex items-center gap-3 mb-3 text-ritual-accent">{icon}
        <h3 className="text-lg font-semibold text-ritual-fg">{title}</h3>
      </div>
      <p className="text-sm text-ritual-muted">{desc}</p>
    </Link>
  );
}