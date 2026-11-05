import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, Search, X, Users, PhoneOff, MapPin } from "lucide-react";
import customers from "@/data/customers.json";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Plaza Customers — Search & Call" },
      { name: "description", content: "Search all Plaza customers and call any of them with one tap." },
      { property: "og:title", content: "Plaza Customers — Search & Call" },
      { property: "og:description", content: "Search all Plaza customers and call any of them with one tap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Customer = { id: number; name: string; phone: string };
const list = customers as Customer[];

function splitName(name: string) {
  const m = name.match(/^([^(]+)\((.+?)\)\s*(?:\((\d+)\))?/);
  if (!m) return { city: "", shop: name, code: "" };
  return { city: (m[1] ?? "").trim(), shop: (m[2] ?? name).trim(), code: m[3] ?? "" };
}

function Index() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const digits = s.replace(/\D/g, "");
    if (!s) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        (digits.length > 0 && c.phone.replace(/\D/g, "").includes(digits)),
    );
  }, [q]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="animate-blob absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="animate-blob absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent/15 blur-3xl [animation-delay:-5s]" />
        <div className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/15 blur-3xl [animation-delay:-9s]" />
      </div>

      <header className="mx-auto max-w-5xl px-4 pt-6 text-center sm:pt-10">
        <img src={logo} alt="Plaza Customers logo" width={1024} height={1024} className="animate-float mx-auto h-16 w-16 drop-shadow-2xl sm:h-24 sm:w-24" />
        <h1 className="animate-rise mt-3 text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-5xl">
          <span className="text-brand">Plaza</span> Customers
        </h1>
        <p className="animate-rise mt-2 text-muted-foreground [animation-delay:.1s]">
          Search any customer and call with one tap
        </p>
        <div className="animate-rise mt-4 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm backdrop-blur [animation-delay:.2s]">
          <Users className="h-4 w-4 text-primary" /> {list.length} customers
        </div>
      </header>

      <div className="sticky top-0 z-20 mx-auto max-w-5xl px-3 py-3 sm:px-4 sm:py-5">
        <div className="group relative animate-rise [animation-delay:.3s]">
          <div className="bg-brand absolute -inset-0.5 rounded-2xl opacity-40 blur transition group-focus-within:opacity-90" />
          <div className="relative flex items-center gap-2 rounded-2xl border bg-card/90 px-3 backdrop-blur-xl sm:gap-3 sm:px-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition group-focus-within:scale-110 group-focus-within:text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, city or number..."
              className="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:h-14 sm:text-lg"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search" className="rounded-full p-1 text-muted-foreground transition hover:rotate-90 hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">{results.length} result{results.length !== 1 && "s"}</p>
      </div>

      <main className="mx-auto grid max-w-5xl gap-2.5 px-3 pb-16 sm:gap-3 sm:px-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c, i) => {
          const { city, shop, code } = splitName(c.name);
          const has = !!c.phone;
          return (
            <div
              key={c.id + q}
              style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}
              className="animate-rise group relative flex items-center gap-2.5 rounded-2xl border bg-card/70 p-3 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow sm:gap-3 sm:p-4"
            >
              <div className="bg-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-primary-foreground transition group-hover:rotate-6 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-lg">
                {shop.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold sm:text-base">{shop}</p>
                {city && (
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{city}</span> {code && <span className="shrink-0 rounded bg-muted px-1.5">#{code}</span>}
                  </p>
                )}
                <p className="mt-0.5 truncate font-mono text-xs text-primary sm:text-sm">{c.phone || "No number"}</p>
              </div>
              {has ? (
                <a
                  href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                  aria-label={`Call ${shop}`}
                  className="bg-brand animate-pulse-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary-foreground transition hover:scale-110 active:scale-95 sm:h-12 sm:w-12"
                >
                  <Phone className="h-5 w-5 group-hover:animate-ring" />
                </a>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:h-12 sm:w-12">
                  <PhoneOff className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="animate-rise col-span-full py-16 text-center text-muted-foreground">No customer found for "{q}"</div>
        )}
      </main>
    </div>
  );
}
