import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, Search, X, Users, MapPin } from "lucide-react";
import customers from "@/data/customers.json";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterCustomers, getCityOptions, splitName } from "@/lib/customer-filters";

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

const list = customers;
const cities = getCityOptions(list);
const unassignedCount = list.filter(c => !splitName(c.name).city).length;

function Index() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const results = useMemo(() => filterCustomers(list, q, city), [q, city]);

  return (
    <div className="directory-page relative min-h-dvh">

      <header className="mx-auto max-w-5xl px-4 pt-6 text-center sm:pt-10">
        <img src={logo} alt="Plaza Customers logo" width={1024} height={1024} className="animate-float mx-auto h-16 w-16 drop-shadow-2xl sm:h-24 sm:w-24" />
        <h1 className="animate-rise mt-3 text-2xl font-extrabold sm:mt-4 sm:text-5xl">
          <span className="text-brand">Plaza</span> Customers
        </h1>
        <p className="animate-rise mt-2 text-muted-foreground [animation-delay:.1s]">
          Search any customer and call with one tap
        </p>
        <div className="animate-rise mt-4 inline-flex items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-sm backdrop-blur [animation-delay:.2s]">
          <Users className="h-4 w-4 text-primary" /> {list.length} customers
        </div>
      </header>

      <div className="directory-controls sticky top-0 z-20 mx-auto w-full min-w-0 max-w-5xl bg-background/95 px-3 py-3 backdrop-blur-xl sm:px-4 sm:py-5">
        <div className="group relative animate-rise [animation-delay:.3s]">
          <div className="bg-brand absolute -inset-0.5 rounded-2xl opacity-40 blur transition group-focus-within:opacity-90" />
          <div className="relative flex items-center gap-2 rounded-2xl border bg-card/90 px-3 backdrop-blur-xl sm:gap-3 sm:px-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground transition group-focus-within:scale-110 group-focus-within:text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, city or number..."
              aria-label="Search customers"
              className="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:h-14 sm:text-lg"
            />
            {q && (
              <Button variant="ghost" size="icon" onClick={() => setQ("")} aria-label="Clear search" className="shrink-0 rounded-full text-muted-foreground transition hover:rotate-90 hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger aria-label="Filter by city" className="h-11 min-w-0 gap-2 bg-card text-base [&>span]:min-w-0 [&>span]:flex-1 [&>span]:truncate [&>span]:text-left [&>svg]:shrink-0">
              <MapPin className="h-4 w-4 shrink-0 text-primary" /><SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72 w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-1.5rem)]">
              <SelectItem value="all">All cities ({list.length})</SelectItem>
              {cities.map(option => <SelectItem key={option.city} value={option.city}>{option.city} ({option.count})</SelectItem>)}
              {unassignedCount > 0 && <SelectItem value="unassigned">No city listed ({unassignedCount})</SelectItem>}
            </SelectContent>
          </Select>
          {(city !== "all" || q) && <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" aria-label="Reset filters" title="Reset filters" onClick={() => { setCity("all"); setQ(""); }}><X /></Button>}
        </div>
        <p aria-live="polite" className="mt-2 text-center text-xs text-muted-foreground">{results.length} result{results.length !== 1 && "s"}</p>
      </div>

      <main className="directory-results mx-auto grid w-full min-w-0 max-w-5xl grid-cols-1 gap-2.5 px-3 pb-16 sm:gap-3 sm:px-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c, i) => {
          const { city, shop, code } = splitName(c.name);
          const has = !!c.phone;
          return (
            <div
              key={c.id}
              style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}
              className="animate-rise group relative grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border bg-card/70 p-3 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow sm:gap-3 sm:p-4"
            >
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="bg-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-primary-foreground transition group-hover:rotate-6 group-hover:scale-110 sm:h-12 sm:w-12 sm:text-lg">
                {shop.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold [overflow-wrap:anywhere] sm:text-base">{shop}</p>
                {city && (
                  <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" /> <span className="min-w-0 break-words [overflow-wrap:anywhere]">{city}</span> {code && <span className="shrink-0 rounded bg-muted px-1.5">#{code}</span>}
                  </p>
                )}
                <p className="mt-0.5 break-words font-mono text-xs text-primary [overflow-wrap:anywhere] sm:text-sm">{c.phone || "No number"}</p>
              </div>
              </div>
              {has ? (
                <Button asChild className="bg-brand animate-pulse-ring h-11 w-11 shrink-0 rounded-full p-0 text-primary-foreground transition hover:scale-110 active:scale-95 sm:h-12 sm:w-12">
                <a
                  href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                  aria-label={`Call ${shop}`}
                >
                  <Phone className="h-5 w-5 group-hover:animate-ring" />
                </a>
                </Button>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground sm:h-12 sm:w-12">
                  <PhoneOff className="h-5 w-5" />
                </div>
              )}
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="animate-rise col-span-full break-words py-16 text-center text-muted-foreground [overflow-wrap:anywhere]">No customers found{q && <> for "{q}"</>}{city !== "all" && <> in {city === "unassigned" ? "No city listed" : city}</>}</div>
        )}
      </main>
    </div>
  );
}
