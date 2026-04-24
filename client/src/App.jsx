import { useState, useMemo } from "react";

const apps = [
  {
    id: "automotive",
    icon: "🔧",
    name: "ADR Auto Portal",
    division: "Automotive",
    version: "v3.2.1",
    platform: "iOS & Android",
    access: "Internal",
    status: "stable",
    rating: "4.8",
    ratingCount: "124",
    stars: 5,
    tags: ["Manufacturing", "OEM", "QC"],
    tagline: "End-to-end management for automotive component production, OEM orders, and quality control.",
    desc: "End-to-end management for automotive component production, OEM orders, and quality control across all manufacturing plants.",
    about:
      "ADR Auto Portal is the central digital hub for ADR Group's Automotive Division. Used by production supervisors, QC teams, and procurement managers across the Kapuk and Tangerang plants, it brings together purchase orders, quality inspection logs, OEM delivery schedules, and supplier communications in a single, mobile-first platform. Integrated with the ERP system, it provides live production data and automated KPI alerts.",
    category: "Manufacturing",
    size: "48.2 MB",
    updated: "12 Apr 2026",
    users: "1,200+ active",
  },
  {
    id: "agro",
    icon: "🌿",
    name: "ADR Agro Manager",
    division: "Agribusiness",
    version: "v1.5.0",
    platform: "Android",
    access: "Field Use",
    status: "beta",
    rating: "4.3",
    ratingCount: "68",
    stars: 4,
    tags: ["Palm Oil", "MDF", "Forestry"],
    tagline: "Plantation monitoring, MDF mill operations, and harvest tracking for ADR Agribusiness division.",
    desc: "Plantation monitoring, MDF mill operations, and harvest tracking for ADR's agribusiness division across Kalimantan and Sumatra.",
    about:
      "ADR Agro Manager empowers field officers and mill supervisors to record, track, and report on plantation activities in real time. Designed for use in low-connectivity environments, the app supports offline data capture that syncs automatically when a connection is available. It covers palm oil harvest logging, MDF production batch reporting, and industrial forestry compliance documentation.",
    category: "Agribusiness",
    size: "32.7 MB",
    updated: "3 Mar 2026",
    users: "420+ active",
  },
  {
    id: "property",
    icon: "🏙️",
    name: "ADR Property Hub",
    division: "Property",
    version: "v2.0.4",
    platform: "Web & Mobile",
    access: "Enterprise",
    status: "stable",
    rating: "4.7",
    ratingCount: "41",
    stars: 5,
    tags: ["Tenant CRM", "Pipeline", "Finance"],
    tagline: "Property project pipeline, tenant management, and investment tracking across Jakarta, Bali, and Batam.",
    desc: "Property project pipeline, tenant management, and investment tracking across ADR's portfolio in Jakarta, Bali, and Batam.",
    about:
      "ADR Property Hub serves the Property Division's development and asset management teams. It provides a complete view of ongoing construction projects, tenant lease agreements, maintenance scheduling, and financial performance per asset. The app integrates with the accounting system to surface occupancy rates, rental income, and CAPEX tracking on a single dashboard available to executives and site managers alike.",
    category: "Property",
    size: "61.4 MB",
    updated: "28 Mar 2026",
    users: "380+ active",
  },
  {
    id: "distribution",
    icon: "📦",
    name: "ADR Distribusi",
    division: "Distribution",
    version: "v4.0.2",
    platform: "iOS & Android",
    access: "Logistics",
    status: "stable",
    rating: "4.5",
    ratingCount: "209",
    stars: 4,
    tags: ["Warehouse", "Logistics", "Inventory"],
    tagline: "Real-time distribution tracking, warehouse inventory, and logistics coordination across 5 regional offices.",
    desc: "Real-time distribution tracking, warehouse inventory, and logistics coordination across 5 regional distribution offices throughout Indonesia.",
    about:
      "ADR Distribusi connects the group's five regional distribution companies — from Surabaya to Riau — under one logistics management platform. Warehouse staff use it to manage incoming and outgoing stock, dispatch personnel use it to coordinate deliveries, and management uses the analytics dashboard to monitor fulfilment rates, slow-moving inventory, and inter-branch transfers. The app integrates with third-party courier APIs for automated shipment tracking.",
    category: "Logistics",
    size: "54.9 MB",
    updated: "10 Apr 2026",
    users: "2,100+ active",
  },
  {
    id: "hr",
    icon: "👥",
    name: "ADR People",
    division: "HR",
    version: "v2.3.0",
    platform: "Web",
    access: "Internal",
    status: "stable",
    rating: "4.6",
    ratingCount: "312",
    stars: 5,
    tags: ["Payroll", "Attendance", "Recruitment"],
    tagline: "Unified HR management covering payroll, attendance, and employee lifecycle for all ADR entities.",
    desc: "Unified HR management platform covering payroll processing, attendance tracking, leave management, and end-to-end recruitment.",
    about:
      "ADR People is the group-wide human resources platform used by HR managers and employees across all divisions. It handles monthly payroll runs, leave approvals, attendance reconciliation, and new hire onboarding workflows. Integrated with the biometric attendance systems at each site.",
    category: "Human Resources",
    size: "22.1 MB",
    updated: "1 Apr 2026",
    users: "4,000+ active",
  },
  {
    id: "finance",
    icon: "💹",
    name: "ADR Finance",
    division: "Finance",
    version: "v3.0.1",
    platform: "Web",
    access: "Enterprise",
    status: "stable",
    rating: "4.9",
    ratingCount: "87",
    stars: 5,
    tags: ["Accounting", "Reporting", "Budget"],
    tagline: "Group-wide financial reporting, budget tracking, and inter-company consolidation.",
    desc: "Group-wide financial reporting, budget planning, and inter-company consolidation across all ADR business entities.",
    about:
      "ADR Finance is the consolidation and reporting hub for the group's finance teams. It pulls data from each business unit's accounting system to generate consolidated P&L, balance sheets, and cash flow reports. Budget vs actual tracking and approval workflows are built in.",
    category: "Finance",
    size: "18.6 MB",
    updated: "8 Apr 2026",
    users: "650+ active",
  },
];

const ALL_DIVISIONS = ["All", ...Array.from(new Set(apps.map((a) => a.division)))];
const ALL_PLATFORMS = ["All", ...Array.from(new Set(apps.map((a) => a.platform)))];

const FEATURES = [
  "Real-time dashboard with live operational data and KPI tracking",
  "Automated workflow approvals with multi-level sign-off support",
  "Integrated document management with version control",
  "Push notifications and alerts for critical operational updates",
  "Offline mode support for field operations without connectivity",
  "Role-based access control with enterprise SSO integration",
];

const REVIEWS = [
  {
    initials: "BS",
    name: "Budi Santoso",
    role: "Operations Manager",
    stars: 5,
    text: "This app has significantly improved how our team handles day-to-day operations. The interface is clean and easy to navigate even for non-technical staff.",
  },
  {
    initials: "RP",
    name: "Rina Pratiwi",
    role: "QC Supervisor",
    stars: 4,
    text: "Solid application with useful reporting features. Would love to see more export options in a future update, but overall very satisfied with the performance.",
  },
  {
    initials: "AW",
    name: "Ahmad Wijaya",
    role: "Site Coordinator",
    stars: 5,
    text: "Offline mode is a game changer for our field teams. Data syncs seamlessly once we're back in range. Highly recommended for remote operations.",
  },
];

// ─── Shared components ───────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (status === "stable")
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Stable
      </span>
    );
  if (status === "beta")
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        Beta
      </span>
    );
  return null;
}

function Stars({ count, size = "sm" }) {
  return (
    <span className={`text-amber-400 tracking-tight ${size === "lg" ? "text-base" : "text-xs"}`}>
      {Array.from({ length: 5 }, (_, i) => (i < count ? "★" : "☆")).join("")}
    </span>
  );
}

function Navbar({ onLogoClick }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          onClick={onLogoClick}
        >
          <div className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center text-[11px] font-bold text-white tracking-wide">
            ADR
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-700">App Portal</span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 font-medium">
            Internal
          </span>
        </div>
        <div className="text-[11px] text-gray-400 hidden sm:block">
          {apps.length} applications · ADR Group of Companies
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 py-6 px-6 text-center text-[11px] text-gray-400 bg-white">
      <span className="font-semibold text-gray-600">ADR Group of Companies</span>
      {" "}· Wisma ADR, Jl. Pluit Raya I No. 1, North Jakarta · Internal use only · © 2026
    </footer>
  );
}

// ─── App Card ────────────────────────────────────────────────────────────────

function AppCard({ app, onViewDetail }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-red-300 hover:shadow-md transition-all duration-150 flex flex-col">
      <div className="h-0.5 w-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-xl shrink-0">
              {app.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">{app.name}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{app.division} Division</div>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        {/* Tagline */}
        <p className="text-[12px] text-gray-500 leading-relaxed flex-1">{app.tagline}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {app.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Stars count={app.stars} />
            <span className="text-[11px] text-gray-400">{app.rating} ({app.ratingCount})</span>
          </div>
          <button
            onClick={() => onViewDetail(app)}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors border-none cursor-pointer shrink-0"
          >
            View Detail →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Directory Page ───────────────────────────────────────────────────────────

function DirectoryPage({ onViewDetail }) {
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.division.toLowerCase().includes(q) ||
        app.tags.some((t) => t.toLowerCase().includes(q)) ||
        app.tagline.toLowerCase().includes(q);
      const matchDivision = divisionFilter === "All" || app.division === divisionFilter;
      const matchPlatform = platformFilter === "All" || app.platform === platformFilter;
      return matchSearch && matchDivision && matchPlatform;
    });
  }, [search, divisionFilter, platformFilter]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Application Directory</h1>
        <p className="text-sm text-gray-400">Find and access internal tools across all ADR divisions.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">⌕</span>
          <input
            type="text"
            placeholder="Search by name, division, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-8 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all cursor-pointer shadow-sm"
        >
          {ALL_DIVISIONS.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All Divisions" : d}</option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all cursor-pointer shadow-sm"
        >
          {ALL_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <p className="text-[11px] text-gray-400 mb-5">
        {filtered.length === apps.length
          ? `Showing all ${apps.length} apps`
          : `${filtered.length} of ${apps.length} apps`}
        {search && (
          <span className="ml-1">
            for <span className="text-gray-600 font-medium">"{search}"</span>
          </span>
        )}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} onViewDetail={onViewDetail} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="text-4xl mb-3 opacity-20">⊘</div>
          <div className="text-sm text-gray-500">No apps match your search.</div>
          <button
            onClick={() => { setSearch(""); setDivisionFilter("All"); setPlatformFilter("All"); }}
            className="mt-3 text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors bg-transparent border-none cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

// ─── Detail Page ──────────────────────────────────────────────────────────────

function DetailPage({ app, onBack }) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors mb-8 bg-transparent border-none cursor-pointer p-0 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Back to App Directory</span>
      </button>

      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="h-1 w-full bg-red-600" />
        <div className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-4xl shrink-0 shadow-sm">
              {app.icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{app.name}</h1>
                <StatusBadge status={app.status} />
                <span className="text-[11px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  {app.version}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-2xl">{app.desc}</p>
              <div className="flex flex-wrap gap-2">
                <button className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors border-none cursor-pointer">
                  ⬇ Download App
                </button>
                <button className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                  Request Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left col — 2/3 */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* About */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About This App</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{app.about}</p>
          </div>

          {/* Key Features */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Screenshots */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Screenshots</h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-gray-50 border border-gray-200 rounded-xl aspect-[9/16] flex flex-col items-center justify-center gap-2"
                >
                  <span className="text-2xl opacity-20">📱</span>
                  <span className="text-[9px] text-gray-400">Screen {n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">User Reviews</h2>
              <div className="flex items-center gap-1.5">
                <Stars count={app.stars} size="lg" />
                <span className="text-sm font-semibold text-gray-700">{app.rating}</span>
                <span className="text-xs text-gray-400">({app.ratingCount})</span>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {REVIEWS.map((review, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {review.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700">{review.name}</div>
                      <div className="flex items-center gap-1.5">
                        <Stars count={review.stars} />
                        <span className="text-[10px] text-gray-400">{review.role}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col — 1/3 sidebar */}
        <div className="flex flex-col gap-4">

          {/* App Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">App Info</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                ["Version", app.version],
                ["Division", app.division],
                ["Category", app.category],
                ["Platform", app.platform],
                ["Access", app.access],
                ["Size", app.size],
                ["Updated", app.updated],
                ["Active Users", app.users],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2.5 text-xs">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-semibold text-gray-700 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tags</h2>
            <div className="flex flex-wrap gap-1.5">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 border border-gray-200 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Support</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              <div className="flex justify-between items-center py-2.5 text-xs">
                <span className="text-gray-400">Contact</span>
                <span className="text-red-600 font-semibold">apps@adr-group.co.id</span>
              </div>
              <div className="flex justify-between items-center py-2.5 text-xs">
                <span className="text-gray-400">Hours</span>
                <span className="text-gray-700 font-semibold">Mon–Fri, 08–17 WIB</span>
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
            <button className="w-full text-sm font-semibold py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors border-none cursor-pointer">
              ⬇ Download for iOS
            </button>
            <button className="w-full text-sm font-medium py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors bg-white cursor-pointer">
              Download for Android
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("directory"); // "directory" | "detail"
  const [selectedApp, setSelectedApp] = useState(null);

  const goToDetail = (app) => {
    setSelectedApp(app);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToDirectory = () => {
    setPage("directory");
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar onLogoClick={goToDirectory} />

      {page === "directory" && <DirectoryPage onViewDetail={goToDetail} />}
      {page === "detail" && selectedApp && <DetailPage app={selectedApp} onBack={goToDirectory} />}

      <Footer />
    </div>
  );
}