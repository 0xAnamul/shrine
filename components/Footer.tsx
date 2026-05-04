import { Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ritual-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-ritual-muted font-mono">
          © {new Date().getFullYear()} shrine — built on ritual testnet
        </p>
        <div className="flex gap-3">
          <a href="https://x.com/yourhandle" target="_blank"
             className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ritual-border
                        hover:border-ritual-accent hover:text-ritual-accent transition">
            <Twitter size={16} /> <span className="text-sm">Twitter / X</span>
          </a>
          <a href="https://discord.gg/yourinvite" target="_blank"
             className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ritual-border
                        hover:border-ritual-accent hover:text-ritual-accent transition">
            <MessageCircle size={16} /> <span className="text-sm">Discord</span>
          </a>
        </div>
      </div>
    </footer>
  );
}