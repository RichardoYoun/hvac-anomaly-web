import Link from "next/link";
import {
  Activity,
  AirVent,
  ArrowRight,
  Building2,
  Check,
  Cpu,
  Gauge,
  LineChart,
  Lock,
  Shield,
  Terminal,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />
      <Hero />
      <ProductGrid />
      <CustomerMarquee />
      <BackboneSection />
      <CapabilitiesSplit />
      <PillarsSection />
      <DeveloperSection />
      <TestimonialSection />
      <EnterpriseSection />
      <GlobalLogos />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-28 pb-28 md:pt-36 md:pb-36">
      <BackgroundPaths />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              PowerSense v2 · now generally available
            </div>
            <h1 className="mt-6 text-[52px] font-light leading-[0.98] tracking-[-0.02em] text-white md:text-[80px]">
              Intelligent
              <br />
              infrastructure
              <br />
              to protect every
              <br />
              building
            </h1>
            <p className="mt-8 max-w-xl text-lg font-light text-white/50 md:text-xl">
              Join the operators, owners, and portfolio managers who use
              PowerSense to monitor HVAC and electrical systems in real time,
              catch anomalies before tenants notice, and reduce energy spend
              across every unit.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Contact sales
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <HeroDevice />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroDevice() {
  return (
    <div className="relative mx-auto w-full max-w-[360px] ps-float">
      <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/5 p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="rounded-[32px] bg-zinc-950 p-5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5 font-medium text-white">
              <Zap className="h-3.5 w-3.5 text-white" />
              PowerSense
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-40" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white opacity-60" />
              </span>
              Live
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              Building A · Suite 204
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <div className="text-[38px] font-light leading-none tracking-tight text-white">
                72.4
              </div>
              <div className="text-sm text-zinc-600">°F setpoint</div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-white/60">
              <Check className="h-3 w-3" /> Operating normally
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-zinc-900 p-3">
            <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              <span>Draw · 24h</span>
              <span className="text-white/60">4.2 kW avg</span>
            </div>
            <svg viewBox="0 0 220 80" className="h-20 w-full">
              <defs>
                <linearGradient id="hero-g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 62 L22 54 L44 58 L66 42 L88 46 L110 32 L132 38 L154 24 L176 28 L198 18 L220 22 L220 80 L0 80 Z"
                fill="url(#hero-g1)"
              />
              <path
                d="M0 62 L22 54 L44 58 L66 42 L88 46 L110 32 L132 38 L154 24 L176 28 L198 18 L220 22"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="mt-4 space-y-2">
            {[
              { label: "AC-1 · Rooftop", draw: "3.8 kW" },
              { label: "AC-2 · Mezzanine", draw: "6.1 kW" },
              { label: "AC-3 · Server rm.", draw: "4.4 kW" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900 px-3 py-2.5 text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <span className="text-zinc-400">{row.label}</span>
                </div>
                <span className="font-mono text-xs font-medium text-white">
                  {row.draw}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black">
            View all units <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <h2 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
            Flexible monitoring built to scale across every building
          </h2>
        </div>
        <div className="md:col-span-6 md:pt-4">
          <p className="text-lg font-light text-zinc-500">
            PowerSense is a single platform for HVAC and electrical telemetry.
            Plug into the equipment you already operate, detect drift in
            real-time, and uncover the efficiency gains hidden in your
            portfolio — without a forklift upgrade.
          </p>
          <Link
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Browse all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <ProductCard
          eyebrow="Live telemetry"
          title="Stream every sensor, from every unit, in real time."
          bullets={["BACnet", "Modbus", "MQTT", "Webhooks", "Historian"]}
          illustration={<TelemetryArt />}
        />
        <ProductCard
          eyebrow="Anomaly detection"
          title="Catch failures before a single tenant picks up the phone."
          bullets={["Scoring", "Baselines", "Alerting", "Runbooks"]}
          illustration={<AnomalyArt />}
        />
        <ProductCard
          eyebrow="Energy insights"
          title="Attribute usage, forecast cost, and prove savings."
          bullets={["Metering", "Tariffs", "EIA pricing", "Per-tenant", "Reports"]}
          illustration={<EnergyArt />}
        />
      </div>
    </section>
  );
}

function ProductCard({
  eyebrow,
  title,
  bullets,
  illustration,
}: {
  eyebrow: string;
  title: string;
  bullets: string[];
  illustration: React.ReactNode;
}) {
  return (
    <article className="group rounded-3xl border border-white/5 bg-zinc-900 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/10">
      <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-zinc-800">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {illustration}
        </div>
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm">
            {eyebrow}
          </span>
        </div>
      </div>
      <h3 className="mt-6 text-[22px] font-normal leading-[1.15] tracking-[-0.01em] text-white">
        {title}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400"
          >
            {b}
          </li>
        ))}
      </ul>
      <Link
        href="#"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition hover:text-white group-hover:gap-2"
      >
        Learn more <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function TelemetryArt() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full opacity-60">
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M0 90 Q50 70 100 82 T200 60" opacity="0.9" />
        <path d="M0 70 Q50 50 100 62 T200 40" opacity="0.6" />
        <path d="M0 50 Q50 30 100 42 T200 20" opacity="0.35" />
      </g>
      {[{ x: 40, y: 82 }, { x: 90, y: 70 }, { x: 140, y: 52 }, { x: 180, y: 36 }].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
      ))}
    </svg>
  );
}

function AnomalyArt() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full opacity-60">
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M10 80 L40 70 L70 78 L100 40 L130 88 L160 60 L190 64" />
      </g>
      <circle cx="100" cy="40" r="18" fill="#fff" fillOpacity="0.1" />
      <circle cx="100" cy="40" r="10" fill="#fff" fillOpacity="0.8" />
      <g fill="#fff">
        <rect x="10" y="98" width="32" height="5" rx="2.5" opacity="0.4" />
        <rect x="48" y="98" width="24" height="5" rx="2.5" opacity="0.25" />
        <rect x="78" y="98" width="40" height="5" rx="2.5" opacity="0.4" />
      </g>
    </svg>
  );
}

function EnergyArt() {
  const bars = [30, 55, 42, 70, 58, 82, 65, 95, 78];
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full opacity-60">
      {bars.map((h, i) => (
        <rect key={i} x={10 + i * 21} y={110 - h} width="14" height={h} rx="3"
          fill="#fff" opacity={0.2 + (i / bars.length) * 0.5} />
      ))}
      <path d="M10 90 Q60 60 110 50 T200 20" stroke="#fff" strokeWidth="2"
        fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function CustomerMarquee() {
  const names = [
    "Ridgeview Properties", "Northgate REIT", "Harbor Industrial",
    "Vertex Campus", "Meridian Health", "Ashford Labs",
    "Brightline", "Summit Group", "Keystone Holdings",
    "Cascadia Realty", "Lakeshore Towers", "Fairmark",
  ];
  const doubled = [...names, ...names];
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-zinc-950 py-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-zinc-950 to-transparent" />
      <div className="flex w-max ps-marquee gap-12 px-6 text-white/30">
        {doubled.map((n, i) => (
          <span key={i} className="shrink-0 text-[17px] font-light tracking-tight">{n}</span>
        ))}
      </div>
    </section>
  );
}

function BackboneSection() {
  return (
    <section className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-[48px] font-light leading-[1.03] tracking-[-0.02em] text-white md:text-[72px]">
          The backbone of
          <br />
          building intelligence
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-light text-zinc-500">
          From single-site operators to multi-campus portfolios, teams choose
          PowerSense to keep critical HVAC and electrical infrastructure
          humming — twenty-four hours a day, every day of the year.
        </p>
        <div className="mt-20 grid gap-16 md:grid-cols-3">
          <BigStat value="12K+" label="Rooftop and split units under continuous monitoring" />
          <BigStat value="99.95%" label="Telemetry uptime measured across the past twelve months" />
          <BigStat value="22%" label="Average reduction in HVAC energy spend after ninety days" />
        </div>
      </div>
    </section>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[76px] font-light leading-none tracking-[-0.03em] text-white md:text-[96px]">
        {value}
      </div>
      <div className="mx-auto mt-5 max-w-[260px] text-sm font-light leading-relaxed text-zinc-500">
        {label}
      </div>
    </div>
  );
}

function CapabilitiesSplit() {
  return (
    <section className="border-t border-white/5 bg-zinc-950 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-12 md:items-center">
          <div className="order-2 md:order-1 md:col-span-6">
            <PortfolioIllustration />
          </div>
          <div className="order-1 md:order-2 md:col-span-6">
            <div className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-zinc-500">
              Portfolio scale
            </div>
            <h2 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
              Powerful APIs for every HVAC and electrical system in your portfolio
            </h2>
            <p className="mt-6 text-lg font-light text-zinc-500">
              PowerSense normalizes telemetry from the equipment you already
              own — VRFs, RTUs, chillers, sub-meters — and turns it into a
              single, clean API. Start monitoring a new building in hours, not quarters.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "BACnet, Modbus, and MQTT ingestion for existing equipment",
                "SOC 2 Type II certified data handling with tenant-level access",
                "Anomaly scoring trained on billions of sensor readings",
                "Edge-buffered gateways so nothing is lost when WAN drops",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-zinc-400">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              Explore the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioIllustration() {
  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/5 bg-zinc-900">
      <div className="absolute inset-0 grid grid-cols-4 gap-3 p-6">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = [60, 85, 72, 95, 68, 80, 90, 75, 88, 65, 78, 92];
          const opacities = [0.3, 0.5, 0.4, 0.6, 0.35, 0.5, 0.55, 0.45, 0.6, 0.3, 0.5, 0.65];
          return (
            <div key={i} className="flex items-end">
              <div
                className="w-full rounded-t-lg bg-white"
                style={{ height: `${heights[i]}%`, opacity: opacities[i % opacities.length] }}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute left-6 right-6 bottom-6 h-[1px] bg-white/10" />
      <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white/70">
        <Building2 className="h-3.5 w-3.5 text-white/50" />
        48 buildings · live
      </div>
    </div>
  );
}

function PillarsSection() {
  const pillars = [
    { icon: Thermometer, title: "Climate", desc: "Track temperature, humidity, and setpoints across every zone with sub-minute resolution and full historical replay." },
    { icon: Wind, title: "HVAC health", desc: "Continuous anomaly scoring for compressors, fans, and airflow so you can service equipment before it fails." },
    { icon: Gauge, title: "Energy", desc: "Attribute consumption to tenants, benchmark against peers, and cut waste with intelligent scheduling." },
    { icon: Shield, title: "Reliability", desc: "Real-time alerting with on-call rotations, incident timelines, and post-mortem reports out of the box." },
  ];
  return (
    <section className="border-t border-white/5 bg-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-zinc-500">
            A unified platform
          </div>
          <h2 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
            Everything you need to operate a smarter building
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-zinc-500">
            Whether you run a single-tenant office or a national portfolio,
            PowerSense is built to help your operations team move faster with fewer surprises.
          </p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/5 bg-zinc-900 p-6 transition hover:-translate-y-0.5 hover:border-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-zinc-800 transition group-hover:bg-zinc-700">
                <Icon className="h-5 w-5 text-white/70" />
              </div>
              <h3 className="mt-5 text-[18px] font-medium tracking-tight text-white">
                {title}
              </h3>
              <p className="mt-2 text-[14px] font-light leading-relaxed text-zinc-500">
                {desc}
              </p>
              <Link
                href="/dashboard"
                className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-zinc-500 transition hover:text-white group-hover:gap-1.5"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeveloperSection() {
  return (
    <section className="border-t border-white/5 bg-zinc-950 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <div className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-zinc-500">
              <Terminal className="h-4 w-4" />
              Built for builders
            </div>
            <h2 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
              An API designed around the equipment you already run
            </h2>
            <p className="mt-6 text-lg font-light text-zinc-500">
              PowerSense exposes every sensor, anomaly, and event over a
              clean REST and webhook API. Forward telemetry to your warehouse,
              trigger your own runbooks, or embed live status into an existing tenant portal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#docs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90"
              >
                Read docs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
              >
                Try the dashboard
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {[
                { icon: Cpu, label: "Edge gateways" },
                { icon: LineChart, label: "Realtime API" },
                { icon: AirVent, label: "BACnet ready" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-600">
                  <Icon className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-6">
            <CodeCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeCard() {
  const lines: { code: string; tone?: "comment" | "flag" | "value" }[] = [
    { code: "curl https://api.powersense.io/v1/units \\" },
    { code: "  -H 'Authorization: Bearer ps_live_***' \\", tone: "flag" },
    { code: "  -G \\", tone: "flag" },
    { code: "  --data-urlencode 'building=building-a' \\", tone: "value" },
    { code: "  --data-urlencode 'status=anomaly'", tone: "value" },
    { code: "" },
    { code: "# → 3 units flagged in the last 15 minutes", tone: "comment" },
  ];
  const toneClass = (t?: string) =>
    t === "comment" ? "text-white/30"
    : t === "flag" ? "text-white/70"
    : t === "value" ? "text-white/50"
    : "text-white/90";
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/10" />
          <span className="ml-3 font-mono text-xs text-white/25">
            ~/powersense — 80×24
          </span>
        </div>
        <span className="rounded-full border border-white/8 px-2 py-0.5 font-mono text-[10px] text-white/30">
          bash
        </span>
      </div>
      <div className="p-6 font-mono text-[13px] leading-7">
        {lines.map(({ code, tone }, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-5 shrink-0 select-none text-white/15">{i + 1}</span>
            <code className={`whitespace-pre ${toneClass(tone)}`}>{code || " "}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="border-t border-white/5 bg-black py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-white/8 bg-zinc-900 p-10 md:p-16">
          <div className="mb-6 text-[13px] font-semibold uppercase tracking-wider text-zinc-500">
            Customer story
          </div>
          <blockquote className="text-[28px] font-light leading-[1.25] tracking-tight text-white md:text-[36px]">
            "PowerSense flagged an AC compressor drift on a Saturday night
            before tenants ever felt the temperature swing. That alert alone
            paid for the year."
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-800 text-white">
              <Building2 className="h-4 w-4 text-white/60" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Priya Anand</div>
              <div className="text-xs font-light text-zinc-500">
                Director of Operations · Ridgeview Properties
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnterpriseSection() {
  const rows = [
    { icon: Lock, title: "Enterprise-grade security", desc: "SOC 2 Type II certified data handling with tenant-level access controls, audit logs, and encryption at rest and in transit." },
    { icon: Zap, title: "99.95% telemetry uptime", desc: "Edge-buffered gateways keep collecting even when WAN links drop, so your data never has gaps when you need it most." },
    { icon: Activity, title: "Unrivaled observability", desc: "Dashboards, anomaly scores, and event timelines show you exactly what every unit is doing — down to the second." },
  ];
  return (
    <section className="border-t border-white/5 bg-zinc-950 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[52px]">
            Made for the most demanding operators
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {rows.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/5 bg-zinc-900 p-8 transition hover:border-white/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-800">
                <Icon className="h-5 w-5 text-white/60" />
              </div>
              <h3 className="mt-6 text-[20px] font-medium tracking-tight text-white">{title}</h3>
              <p className="mt-3 font-light text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobalLogos() {
  const partners = [
    "Ridgeview", "Northgate", "Harbor", "Vertex",
    "Meridian", "Ashford", "Brightline", "Summit",
    "Keystone", "Cascadia", "Lakeshore", "Fairmark",
  ];
  return (
    <section className="border-t border-white/5 bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-[13px] font-semibold uppercase tracking-wider text-zinc-700">
          Trusted by operators and owners of every size
        </p>
        <div className="mt-10 grid grid-cols-3 gap-x-8 gap-y-6 md:grid-cols-6">
          {partners.map((p) => (
            <div key={p} className="flex items-center justify-center text-[17px] font-light tracking-tight text-zinc-700">
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      id="contact"
      className="border-t border-white/5 bg-zinc-950 py-28 md:py-36"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-[52px] font-light leading-[1.03] tracking-[-0.02em] text-white md:text-[80px]">
          Ready to see
          <br />
          your buildings?
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg font-light text-zinc-500">
          Spin up the PowerSense dashboard in minutes — or talk to us about a
          custom rollout across your portfolio.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
          >
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="mailto:hello@powersense.io"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Products",
      links: [
        { label: "Telemetry", href: "#" },
        { label: "Anomaly detection", href: "#" },
        { label: "Energy insights", href: "#" },
        { label: "Alerting", href: "#" },
        { label: "Reports", href: "#" },
        { label: "Tenant portal", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Commercial real estate", href: "#" },
        { label: "Industrial", href: "#" },
        { label: "Healthcare", href: "#" },
        { label: "Multi-campus", href: "#" },
        { label: "Portfolio operators", href: "#" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API reference", href: "#" },
        { label: "System status", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Integrations", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Support", href: "#" },
        { label: "Guides", href: "#" },
        { label: "Customer stories", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact sales", href: "#contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Newsroom", href: "#" },
        { label: "Partners", href: "#" },
      ],
    },
  ];
  return (
    <footer className="border-t border-white/5 bg-black py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black">
                <Zap className="h-4 w-4" strokeWidth={2.2} />
              </span>
              PowerSense
            </div>
            <p className="mt-4 text-sm font-light text-zinc-700">
              United States (English)
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-zinc-400">{col.title}</div>
              <ul className="mt-4 space-y-3 text-sm font-light text-zinc-600">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-zinc-700">
          <div>© {new Date().getFullYear()} PowerSense Technologies, Inc.</div>
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Security</Link>
            <Link href="#" className="hover:text-white">Sitemap</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
