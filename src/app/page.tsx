"use client";

import { useState, useCallback, useEffect } from "react";
import { CHARACTERS, SERVERS, CHAR_IMAGE, RANDOM_IMG, RAINBOW_DIAMONDS_IMG, GOLD_FRAGMENTS_IMG, hasShokanCode, getApiCharacters, getOpbrServer, serverColorFromLabel, accountToPayload, formFromAccount, formatIDR, formatUsdDisplay, extremeCount, type CharKey, type ApiChar, type ServerKey, type ProxyAccount, type SortBy, type SortOrder } from "@/lib/mapping";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

const SERVER_LABEL_KEY: Record<ServerKey, string> = {
  android_global: "server_global_android",
  ios_global: "server_global_ios",
  android_jp: "server_jp_android",
  ios_jp: "server_jp_ios",
};

type Tab = "own" | "customv2";
type GFRange = "" | "1000-3500" | "5600-6400" | "6400-6800" | "7800+";
type ExtremeFilter = "noex" | "ex";

const TABS: { key: Tab; labelKey: string }[] = [
  { key: "own", labelKey: "ready_stock" },
  { key: "customv2", labelKey: "custom_request" },
];

const GF_TABS: { key: GFRange; labelKey: string; min?: number; max?: number; price?: string }[] = [
  { key: "1000-3500", labelKey: "gf_1000_3500", min: 1000, max: 3500 },
  { key: "5600-6400", labelKey: "gf_5600_6400", min: 5600, max: 6400, price: "4400钻石/5600-6400金碎片起带35个6星" },
  { key: "6400-6800", labelKey: "gf_6400_6800", min: 6400, max: 6800, price: "4600钻石/6400-6800金碎片起带35个6星" },
  { key: "7800+", labelKey: "gf_7800", min: 7800, price: "4400钻石/7800金碎片起 带50个6星" },
];

const EX_TABS: { key: ExtremeFilter; labelKey: string }[] = [
  { key: "noex", labelKey: "tanpa_extreme" },
  { key: "ex", labelKey: "ada_extreme" },
];

const SOURCE_LABEL: Record<string, string> = {
  own: "src_own",
  customv1: "src_v1",
  customv2: "src_v2",
};

let cachedApiChars: ApiChar[] | null = null; // module scope cache, hindari refetch tiap pindah tab

const SERVER_COLORS: Record<string, string> = {
  green: "bg-green-900/40 text-green-400 border-green-700",
  blue: "bg-blue-900/40 text-blue-400 border-blue-700",
  amber: "bg-amber-900/40 text-amber-400 border-amber-700",
  red: "bg-red-900/40 text-red-400 border-red-700",
};

export default function Home() {
  const { lang, setLang } = useLang();
  const [tab, setTab] = useState<Tab>("own");
  const [gfRange, setGfRange] = useState<GFRange>("5600-6400");
  const [exFilter, setExFilter] = useState<ExtremeFilter>("ex");
  const [accounts, setAccounts] = useState<ProxyAccount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerKey | "">("");
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAccount, setModalAccount] = useState<ProxyAccount | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [minCharError, setMinCharError] = useState(false);
  const lowRange = gfRange === "1000-3500";
  const apiMode = tab === "customv2" && !lowRange;
  const [apiChars, setApiChars] = useState<ApiChar[] | null>(null);
  const [apiCharsLoading, setApiCharsLoading] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ProxyAccount | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState(() => formFromAccount({ code: "", server: "Global", characters: [], diamonds: 0, fragments: 0, char6: "", os: "Android", loginVia: "Transfer ID (TF ID)", source: "own" } as ProxyAccount));
  const resetForm = () => setForm(formFromAccount({ code: "", server: "Global", characters: [], diamonds: 0, fragments: 0, char6: "", os: "Android", loginVia: "Transfer ID (TF ID)", source: "own" } as ProxyAccount));

  useEffect(() => {
    if (!modalAccount) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalAccount(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalAccount]);

  useEffect(() => {
    fetch("/api/admin/check", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAdmin(!!d.admin))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!apiMode) return;
    if (cachedApiChars) { setApiChars(cachedApiChars); return; }
    let cancelled = false;
    setApiCharsLoading(true);
    fetch("/api/proxy/characters", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? getApiCharacters(data) : [];
        if (list.length) { cachedApiChars = list; setApiChars(list); }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setApiCharsLoading(false); });
    return () => { cancelled = true; };
  }, [apiMode]);

  const handleSearch = useCallback(async (targetPage?: number) => {
    if (tab === "own" && exFilter === "ex" && selectedChars.length < 1) {
      setMinCharError(true);
      setTimeout(() => setMinCharError(false), 3000);
      return;
    }
    if (tab === "customv2" && !lowRange && selectedChars.length < 2) {
      setMinCharError(true);
      setTimeout(() => setMinCharError(false), 3000);
      return;
    }
    setLoading(true); setHasSearched(true);
    const p = targetPage ?? 1;
    try {
      if (tab === "own") {
        const params = new URLSearchParams();
        params.set("source", "own"); params.set("status", "available"); params.set("pageSize", "999");
        params.set("extreme", exFilter);
        if (exFilter === "noex") { params.set("sortBy", "price"); params.set("sortOrder", "asc"); }
        if (selectedServer) { const sv = SERVERS.find((s) => s.key === selectedServer); if (sv) params.set("server", sv.label); }
        if (exFilter === "ex" && selectedChars.length) params.set("characters", selectedChars.join(","));
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`/api/accounts?${params}`);
        const data = await res.json();
        let list = (data.accounts || []).map((a: any) => ({ ...a, characters: a.characters || [] }));
        if (sortBy === "extreme") {
          list = [...list].sort((a, b) => sortOrder === "asc" ? extremeCount(a) - extremeCount(b) : extremeCount(b) - extremeCount(a));
        }
        setAccounts(list);
        setTotal(data.total || 0);
      } else {
        const gf = GF_TABS.find((g) => g.key === gfRange);
        const body: Record<string, unknown> = { servers: selectedServer ? [selectedServer] : [], characters: selectedChars, search: searchTerm, page: p, sortOrder };
        if (sortBy) body.sortBy = sortBy;
        if (!lowRange) { body.minGf = gf?.min; body.maxGf = gf?.max; body.price = gf?.price; }
        const res = await fetch(`/api/proxy/${lowRange ? "customv1" : "customv2"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        setAccounts(data.accounts || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 0); setPage(p);
      }
    } catch { setAccounts([]); setTotal(0); setTotalPages(0); }
    finally { setLoading(false); }
  }, [tab, gfRange, exFilter, selectedServer, selectedChars, searchTerm, sortBy, sortOrder]);

  const clearFilters = () => {
    setSelectedServer(""); setSelectedChars([]); setSearchTerm("");
    setAccounts([]); setHasSearched(false); setTotal(0); setPage(1); setTotalPages(0);
  };

  const handleSubmitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const body = accountToPayload(form);
      const url = editingAccount ? `/api/accounts/${editingAccount.id}` : "/api/accounts";
      const method = editingAccount ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("SAVE ERROR", data.error);
        setSubmitError(data.error || "Gagal menyimpan akun");
        return;
      }
      setShowForm(false);
      setEditingAccount(null);
      resetForm();
      handleSearch();
    } catch (err) {
      console.error("SAVE ERROR", err);
      setSubmitError("Gagal menyimpan akun");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.reload();
  };

  const handleDeleteAccount = (id: string, code: string) => {
    setDeleteTarget({ id, code });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/accounts/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      handleSearch();
    } catch {
      alert(t(lang, "err_hapus"));
      setDeleteTarget(null);
    }
  };

  const toggleChar = (key: string) => {
    setMinCharError(false);
    if (key === "random") {
      setSelectedChars((prev) => prev.includes("random") ? [] : ["random"]);
      return;
    }
    // char normal: hapus "random" kalau ada
    setSelectedChars((prev) => {
      const base = prev.includes("random") ? [] : prev;
      if (tab === "own" && exFilter === "ex") {
        if (base.includes(key)) return base.filter((c) => c !== key);
        if (base.length >= 2) return base;
        return [...base, key];
      }
      return base.includes(key) ? base.filter((c) => c !== key) : [...base, key];
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-8">
          <img
            src="https://res.cloudinary.com/dx0gg88mk/image/upload/v1784165210/1000704453.jpg_idnwa3.jpg"
            alt="Ikubaru"
            className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)] ring-2 ring-[rgba(232,184,75,0.2)] mx-auto mb-3"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent)] tracking-tight">
            OPBR Ikubaru - RD Accounts Stock
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5">{t(lang, "tagline")}</p>
          {admin && (
            <button
              onClick={handleLogout}
              className="mt-3 px-3 py-1.5 bg-[var(--surface-alt)] border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg transition-colors"
            >
              {t(lang, "admin_logout")}
            </button>
          )}
          <div className="mt-3 inline-flex items-center gap-2">
            <span className={`text-xs font-semibold ${lang === "id" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>ID</span>
            <button
              role="switch"
              aria-checked={lang === "en"}
              aria-label="Toggle language"
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="relative w-12 h-6 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] transition-colors"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[var(--accent)] transition-transform ${lang === "en" ? "translate-x-6" : ""}`}
              />
            </button>
            <span className={`text-xs font-semibold ${lang === "en" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>EN</span>
          </div>
        </header>

        {/* Admin Profile + Trust */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <img
                src="https://res.cloudinary.com/dx0gg88mk/image/upload/v1784165210/1000704453.jpg_idnwa3.jpg"
                alt="Admin"
                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent)] ring-2 ring-[rgba(232,184,75,0.2)]"
              />
              <div>
                <p className="text-sm font-semibold text-[var(--accent)]">{t(lang, "store_name")}</p>
                <p className="text-xs text-[var(--text-muted)]">{t(lang, "seller_trusted")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="https://www.instagram.com/opbrsell.ikubaru/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-alt)] rounded-xl hover:bg-[var(--surface-hover)] transition-colors border border-[var(--border)]"
              >
                <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span className="text-sm text-[var(--text)]">opbrsell.ikubaru</span>
              </a>
              <a
                href="https://wa.me/6285162757250"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-xl hover:bg-green-600/30 transition-colors border border-green-700"
              >
                <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                <span className="text-sm text-[var(--text)]">0851-6275-7250</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-[var(--border)]">
          {TABS.map((tab_) => (
            <button
              key={tab_.key}
              onClick={() => { setTab(tab_.key); setSelectedChars([]); setAccounts([]); setHasSearched(false); setGfRange("5600-6400"); setExFilter("ex"); setPage(1); setTotalPages(0); }}
              className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 -mb-px transition-colors font-[family-name:var(--font-rubik)] ${
                tab === tab_.key
                  ? "bg-[var(--surface)] border-[var(--border)] text-[var(--accent)]"
                  : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {t(lang, tab_.labelKey)}
            </button>
          ))}
        </div>

        {/* Ready Stock sub-tabs */}
        {tab === "own" && (
          <div className="flex justify-between items-center gap-2 mb-4">
            <div className="flex gap-2">
              {EX_TABS.map((t2) => (
                <button
                  key={t2.key}
                  onClick={() => { setExFilter(t2.key); setSelectedChars([]); setAccounts([]); setHasSearched(false); setPage(1); setTotalPages(0); }}
                  className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    exFilter === t2.key
                      ? "bg-[var(--accent)] text-[#080e1a] border-[var(--accent)]"
                      : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)]"
                  }`}
                >
                  {t(lang, t2.labelKey)}
                </button>
              ))}
            </div>
            {admin && (
              <button
                onClick={() => { setEditingAccount(null); resetForm(); setShowForm(true); }}
                className="px-3 py-1.5 bg-[var(--accent)] text-[#080e1a] text-xs font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                + Akun Baru
              </button>
            )}
          </div>
        )}

        {/* GF sub-tabs */}
        {tab === "customv2" && (
          <div className="flex gap-2 mb-4">
            {GF_TABS.map((g) => (
              <button
                key={g.key}
                onClick={() => { setGfRange(g.key); setSelectedChars([]); setAccounts([]); setHasSearched(false); setPage(1); setTotalPages(0); }}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  gfRange === g.key
                    ? "bg-[var(--accent)] text-[#080e1a] border-[var(--accent)]"
                    : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)]"
                }`}
              >
                {t(lang, g.labelKey)}
              </button>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{t(lang, "server")}</label>
              <select
                className="w-full px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)]"
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value as ServerKey | "")}
              >
                <option value="">{t(lang, "all_servers")}</option>
                {(tab === "customv2" && !lowRange ? SERVERS.filter((s, i, a) => a.findIndex((x) => x.key === s.key || getOpbrServer([s.key]) === getOpbrServer([x.key])) === i) : SERVERS).map((s) => (
                  <option key={s.key} value={s.key}>{t(lang, SERVER_LABEL_KEY[s.key])}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{t(lang, "cari_kode")}</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]"
                placeholder={t(lang, "search_code_ph")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{t(lang, "urutkan")}</label>
              <select
                className="w-full px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)]"
                value={sortBy ? `${sortBy}-${sortOrder}` : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) { setSortBy(""); return; }
                  const [s, o] = val.split("-") as [SortBy, SortOrder];
                  setSortBy(s); setSortOrder(o);
                }}
              >
                <option value="">{t(lang, "sort_default")}</option>
                <option value="diamonds-desc">{t(lang, "diamond_desc")}</option>
                <option value="diamonds-asc">{t(lang, "diamond_asc")}</option>
                <option value="fragments-desc">{t(lang, "gf_desc")}</option>
                <option value="fragments-asc">{t(lang, "gf_asc")}</option>
                <option value="code-asc">{t(lang, "code_asc")}</option>
                <option value="code-desc">{t(lang, "code_desc")}</option>
                <option value="extreme-desc">{t(lang, "extreme_desc")}</option>
                <option value="extreme-asc">{t(lang, "extreme_asc")}</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => handleSearch()} disabled={loading}
                className="flex-1 px-5 py-2.5 bg-[var(--accent)] text-[#080e1a] text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-all active:scale-[0.97]"
              >
                {loading ? t(lang, "memuat") : t(lang, "cari_akun")}
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 border border-[var(--border)] text-sm rounded-xl hover:bg-[var(--surface-alt)] text-[var(--text-muted)] transition-colors"
                title={t(lang, "hapus_filter")}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <div>
            {!(tab === "own" && exFilter === "noex") && (
              <>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-2 block">{t(lang, "pilih_char")}{" "}{tab === "own" ? (exFilter === "ex" ? t(lang, "ada_extreme") : t(lang, "tanpa_extreme")) : lowRange ? t(lang, "gf_1000_3500") : t(lang, "custom_request")}</label>
            {apiMode && apiCharsLoading && <p className="text-xs text-[var(--text-muted)] mb-1">{t(lang, "memuat_char")}</p>}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-1.5">
              {tab === "own" && exFilter === "ex" && (
                <button
                  onClick={() => toggleChar("random")}
                  title="Random"
                  aria-pressed={selectedChars.includes("random")}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-xl border-2 transition-all ${
                    selectedChars.includes("random")
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                      : "border-transparent hover:border-[var(--border)] opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full">
                    <img src={RANDOM_IMG} alt="Random" className="w-full aspect-[4/3] object-cover rounded-lg" />
                    {selectedChars.includes("random") && (
                      <svg className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    )}
                  </div>
                  <span className="text-[10px] leading-tight text-[var(--text-muted)] truncate w-full text-center">{t(lang, "random")}</span>
                </button>
              )}
              {(apiMode
                ? apiChars ?? CHARACTERS.map((c) => ({ key: c, hasMapping: true as const }))
                : CHARACTERS.map((c) => ({ key: c, hasMapping: true as const }))
              ).map((ch) => {
                const key = ch.key as CharKey;
                const unavailable = lowRange ? !hasShokanCode(key) : false;
                const imgUrl = CHAR_IMAGE[key];
                return (
                  <button
                    key={ch.key}
                    onClick={() => !unavailable && toggleChar(ch.key)}
                    disabled={unavailable} title={ch.key}
                    aria-pressed={selectedChars.includes(ch.key)}
                    aria-label={unavailable ? `${ch.key} tidak tersedia` : ch.key}
                    className={`flex flex-col items-center gap-0.5 p-1 rounded-xl border-2 transition-all ${
                      selectedChars.includes(ch.key)
                        ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                        : unavailable
                          ? "border-transparent opacity-25 cursor-not-allowed grayscale"
                          : "border-transparent hover:border-[var(--border)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-full">
                      {imgUrl ? (
                        <img src={imgUrl} alt={ch.key} className="w-full aspect-[4/3] object-cover rounded-lg" />
                      ) : (
                        <span className="text-[10px] leading-tight flex items-center justify-center h-full px-0.5">{ch.key}</span>
                      )}
                      {selectedChars.includes(ch.key) && (
                        <svg className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      )}
                    </div>
                    <span className="text-[10px] leading-tight text-[var(--text-muted)] truncate w-full text-center">{ch.key}</span>
                  </button>
                );
              })}
            </div>
            {selectedChars.length > 0 && (
              <button className="text-xs text-[var(--red)] mt-2 hover:underline" onClick={() => setSelectedChars([])}>{t(lang, "hapus_semua")} ({selectedChars.length})</button>
            )}
            {selectedChars.length > 0 && selectedChars.length < 2 && tab === "customv2" && !lowRange && (
              <p className="text-xs text-[var(--accent)] mt-1">{t(lang, "min_2_char_search")}</p>
            )}
            {tab === "own" && exFilter === "ex" && selectedChars.length >= 2 && (
              <p className="text-xs text-[var(--accent)] mt-1">{t(lang, "max_2_char_own")}</p>
            )}
              </>
            )}
          </div>
        </div>

        {/* Min chars error */}
        {minCharError && (
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-4 mb-4 text-center animate-[fadeInUp_0.2s_ease-out]">
            <p className="text-sm text-red-400 font-medium">{t(lang, "err_min_2")}</p>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">{t(lang, "mencari")}</p>
          </div>
        ) : !hasSearched ? (
          <div className="text-center py-20">
            <p className="text-base text-[var(--text-muted)]">{t(lang, "mulai_cari")}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-base text-[var(--text-muted)]">{t(lang, "tdk_ada_akun")}</p>
            {tab === "own" && admin && (
              <button
                onClick={() => { setEditingAccount(null); resetForm(); setShowForm(true); }}
                className="mt-4 px-4 py-2 bg-[var(--accent)] text-[#080e1a] text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                + {t(lang, "akun_baru")}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[var(--text-muted)]">{total.toLocaleString()} {t(lang, "akun_ditemukan")}</p>
            </div>

            {tab === "own" && exFilter === "noex" ? (
              <div className="overflow-x-auto border border-[var(--border)] rounded-2xl">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-xs text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--surface-alt)]">
                      <th className="px-3 py-2.5 font-medium">{t(lang, "kode")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "server")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "diamond")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "gf")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "star6_char")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "harga")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "os")}</th>
                      <th className="px-3 py-2.5 font-medium">{t(lang, "login")}</th>
                      {admin && <th className="px-3 py-2.5 font-medium text-right">{t(lang, "aksi")}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr
                        key={acc.code}
                        onClick={() => setModalAccount(acc)}
                        className="border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--surface-alt)] transition-colors"
                      >
                        <td className="px-3 py-2.5"><code className="text-xs font-mono bg-[var(--surface-alt)] px-2 py-1 rounded-lg text-[var(--text)]">{acc.code}</code></td>
                        <td className="px-3 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SERVER_COLORS[serverColorFromLabel(acc.server)] || SERVER_COLORS.green}`}>{acc.server}</span></td>
                        <td className="px-3 py-2.5 text-[var(--text-muted)] whitespace-nowrap">{(acc.diamondsText || acc.diamonds > 0) ? (acc.diamondsText || acc.diamonds.toLocaleString()) : "-"}</td>
                        <td className="px-3 py-2.5 text-[var(--text-muted)] whitespace-nowrap">{(acc.fragmentsText || acc.fragments > 0) ? (acc.fragmentsText || acc.fragments.toLocaleString()) : "-"}</td>
                        <td className="px-3 py-2.5 text-amber-400 font-medium whitespace-nowrap">{acc.char6 || "-"}</td>
                        <td className="px-3 py-2.5 text-[var(--text)] font-semibold whitespace-nowrap">
                          {((acc.price ?? 0) > 0 || (acc.priceUsd ?? 0) > 0) ? (
                            <>{formatIDR(acc.price)}{formatUsdDisplay(acc.priceUsd, acc.priceUsdText) && <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">/ {formatUsdDisplay(acc.priceUsd, acc.priceUsdText)}</span>}</>
                          ) : "-"}
                        </td>
                        <td className="px-3 py-2.5 text-[var(--text-muted)] whitespace-nowrap">{acc.os || "-"}</td>
                        <td className="px-3 py-2.5 text-[var(--text-muted)] whitespace-nowrap">{acc.loginVia || "-"}</td>
                        {admin && (
                          <td className="px-3 py-2.5 text-right whitespace-nowrap">
                            <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => { setEditingAccount(acc); setForm(formFromAccount(acc)); setShowForm(true); }}
                                className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                              >
                                {t(lang, "edit")}
                              </button>
                              <button
                                onClick={() => { if (acc.id) handleDeleteAccount(acc.id, acc.code); }}
                                className="px-2.5 py-1 text-xs rounded-lg border border-red-700 text-red-400 hover:bg-red-900/30 transition-colors"
                              >
                                {t(lang, "hapus")}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {accounts.map((acc, i) => (
                <button
                  key={acc.code}
                  onClick={() => setModalAccount(acc)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="group block bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-left hover:border-[var(--accent)] hover:bg-[var(--surface-alt)] transition-all duration-300 w-full animate-[fadeInUp_0.35s_ease-out_both]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-xs font-mono bg-[var(--surface-alt)] px-2 py-1 rounded-lg text-[var(--text)]">
                      {acc.code}
                    </code>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SERVER_COLORS[serverColorFromLabel(acc.server)] || SERVER_COLORS.green}`}>
                      {acc.server}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm mb-3">
                    {(acc.diamondsText || acc.diamonds > 0) && (
                      <div className="flex items-center gap-1.5">
                        <img src={RAINBOW_DIAMONDS_IMG} alt="" className="w-5 h-5" />
                        <span className="text-[var(--text-muted)]">{acc.diamondsText || acc.diamonds.toLocaleString()}</span>
                      </div>
                    )}
                    {(acc.fragmentsText || acc.fragments > 0) && (
                      <div className="flex items-center gap-1.5">
                        <img src={GOLD_FRAGMENTS_IMG} alt="" className="w-5 h-5" />
                        <span className="text-[var(--text-muted)]">{acc.fragmentsText || acc.fragments.toLocaleString()}</span>
                      </div>
                    )}
                    {acc.char6 != null && (
                      <span className="flex items-center gap-1 text-amber-400 font-medium"><i className="fa-solid fa-star"></i> {acc.char6}</span>
                    )}
                  </div>
                  {tab === "own" && ((acc.price ?? 0) > 0 || (acc.priceUsd ?? 0) > 0) && (
                    <p className="text-sm font-bold text-[var(--text)] mb-2">
                      {t(lang, "harga")}: {formatIDR(acc.price)}
                      {formatUsdDisplay(acc.priceUsd, acc.priceUsdText) && <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">/ {formatUsdDisplay(acc.priceUsd, acc.priceUsdText)}</span>}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {acc.os && <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text-muted)]">{t(lang, "os")}: {acc.os}</span>}
                    {acc.loginVia && <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text-muted)]">{t(lang, "login")}: {acc.loginVia}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(acc.randomCount ?? 0) > 0 ? (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-muted)]">
                        <img src={RANDOM_IMG} alt="" className="w-6 h-6" />
                        <span className="text-[10px] leading-tight">{t(lang, "random_n_char", { n: acc.randomCount ?? 0 })}</span>
                      </span>
                    ) : (
                      acc.characters.map((ch) => (
                        CHAR_IMAGE[ch as CharKey]
                          ? <img key={ch} src={CHAR_IMAGE[ch as CharKey]} alt={ch} title={ch} className="w-11 h-11 rounded-xl object-cover border border-[var(--border)] transition-transform group-hover:scale-105" />
                          : <span key={ch} title={ch} className="w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[10px] text-[var(--text-muted)] flex items-center justify-center px-0.5 text-center leading-tight">{ch}</span>
                      ))
                    )}
                  </div>
                  {tab === "own" && admin && (
                    <div className="flex gap-2 mt-3">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAccount(acc);
                          setForm(formFromAccount(acc));
                          setShowForm(true);
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                      >
                        {t(lang, "edit")}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); if (acc.id) handleDeleteAccount(acc.id, acc.code); }}
                        className="px-2.5 py-1 text-xs rounded-lg border border-red-700 text-red-400 hover:bg-red-900/30 transition-colors cursor-pointer"
                      >
                        {t(lang, "hapus")}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => handleSearch(Math.max(1, page - 1))}
                  disabled={page <= 1 || loading}
                  className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← {t(lang, "sebelumnya")}
                </button>
                <span className="text-sm text-[var(--text-muted)]">{t(lang, "halaman")} {page} / {totalPages}</span>
                <button
                  onClick={() => handleSearch(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages || loading}
                  className="px-4 py-2 text-sm border border-[var(--border)] rounded-xl hover:border-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t(lang, "berikutnya")} →
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {modalAccount && (
          <div role="dialog" aria-modal="true" aria-label={`Detail akun ${modalAccount.code}`} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setModalAccount(null)}>
            <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full p-6 border border-[var(--border)] shadow-2xl animate-[scaleIn_0.15s_ease-out]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-rubik)] text-[var(--accent)]">{modalAccount.code}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border mt-1.5 inline-block ${SERVER_COLORS[serverColorFromLabel(modalAccount.server)] || SERVER_COLORS.green}`}>{modalAccount.server}</span>
                  {modalAccount.os && <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text-muted)] ml-1.5">{t(lang, "os")}: {modalAccount.os}</span>}
                  {modalAccount.loginVia && <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-[var(--surface-alt)] border-[var(--border)] text-[var(--text-muted)] ml-1.5">{t(lang, "login")}: {modalAccount.loginVia}</span>}
                </div>
                <button onClick={() => setModalAccount(null)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1 rounded-xl hover:bg-[var(--surface-alt)]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="bg-[var(--surface-alt)] rounded-xl p-4 mb-5 flex gap-6 text-sm">
                {(modalAccount.diamondsText || modalAccount.diamonds > 0) && (
                  <div className="flex items-center gap-2.5">
                    <img src={RAINBOW_DIAMONDS_IMG} alt="" className="w-7 h-7" />
                    <div><span className="text-[var(--text-muted)] text-xs">{t(lang, "diamond_label")}</span><div className="font-semibold text-[var(--text)]">{modalAccount.diamondsText || modalAccount.diamonds.toLocaleString()}</div></div>
                  </div>
                )}
                {(modalAccount.fragmentsText || modalAccount.fragments > 0) && (
                  <div className="flex items-center gap-2.5">
                    <img src={GOLD_FRAGMENTS_IMG} alt="" className="w-7 h-7" />
                    <div><span className="text-[var(--text-muted)] text-xs">{t(lang, "gf_label")}</span><div className="font-semibold text-[var(--text)]">{modalAccount.fragmentsText || modalAccount.fragments.toLocaleString()}</div></div>
                  </div>
                )}
                {modalAccount.char6 ? (
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-star text-amber-400 text-lg"></i>
                    <div><span className="text-[var(--text-muted)] text-xs">{t(lang, "star6_char")}</span><div className="font-semibold text-amber-400">{modalAccount.char6}</div></div>
                  </div>
                ) : null}
              </div>

              {tab === "own" && ((modalAccount.price ?? 0) > 0 || (modalAccount.priceUsd ?? 0) > 0) && (
                <div className="bg-[var(--surface-alt)] rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-muted)]"><i className="fa-solid fa-tag mr-1"></i>{t(lang, "harga_label")}</span>
                  <div className="font-bold text-[var(--text)]">
                    {formatIDR(modalAccount.price)}
                    {formatUsdDisplay(modalAccount.priceUsd, modalAccount.priceUsdText) && <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">/ {formatUsdDisplay(modalAccount.priceUsd, modalAccount.priceUsdText)}</span>}
                  </div>
                </div>
              )}

              {((tab !== "own" || exFilter !== "noex") || modalAccount.characters.length > 0) && (
                <div className="mb-5">
                  <h3 className="text-xs font-medium text-[var(--text-muted)] mb-2.5">{t(lang, "karakter_extreme")} ({(modalAccount.randomCount ?? 0) > 0 ? modalAccount.randomCount : modalAccount.characters.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {(modalAccount.randomCount ?? 0) > 0 ? (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-muted)]">
                        <img src={RANDOM_IMG} alt="" className="w-8 h-8" />
                        <span className="text-sm">{t(lang, "random_n_char", { n: modalAccount.randomCount ?? 0 })}</span>
                      </div>
                    ) : modalAccount.characters.map((ch) => (
                      <div key={ch} className="flex flex-col items-center gap-0.5" title={ch}>
                        {CHAR_IMAGE[ch as CharKey]
                          ? <img src={CHAR_IMAGE[ch as CharKey]} alt={ch} className="w-14 h-14 rounded-xl object-cover border border-[var(--border)]" />
                          : <span className="w-14 h-14 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[10px] text-[var(--text-muted)] flex items-center justify-center px-0.5 text-center leading-tight">{ch}</span>}
                        <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[64px] text-center leading-tight">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-[var(--text-muted)] mb-1">{t(lang, "sumber")}: {t(lang, SOURCE_LABEL[modalAccount.source] || "src_own")}</p>
              <p className="text-xs text-[var(--text-muted)] mb-5">{t(lang, "hubungi_admin")}</p>

              <a
                href={`https://wa.me/6285162757250?text=${encodeURIComponent(
                  [
                    t(lang, "wa_hello"),
                    "",
                    `${t(lang, "wa_code")} ${modalAccount.code}`,
                    `${modalAccount.diamondsText || modalAccount.diamonds.toLocaleString()} ${t(lang, "wa_rd")}`,
                    `${modalAccount.fragmentsText || modalAccount.fragments.toLocaleString()} ${t(lang, "wa_gf")}`,
                    ...(modalAccount.randomCount && modalAccount.randomCount > 0 ? [t(lang, "random_n_char", { n: modalAccount.randomCount })] : []),
                    ...(modalAccount.char6 ? [`${t(lang, "wa_star6")} ${modalAccount.char6}`] : []),
                    ...modalAccount.characters,
                    ...(modalAccount.loginVia ? [`${t(lang, "wa_login")} ${modalAccount.loginVia}`] : []),
                    ...(modalAccount.os ? [modalAccount.os] : []),
                    ...(((modalAccount.price ?? 0) > 0 || (modalAccount.priceUsd ?? 0) > 0) ? [
                      t(lang, "wa_harga"),
                      `Rp ${(modalAccount.price ?? 0).toLocaleString("id-ID")} | ${formatUsdDisplay(modalAccount.priceUsd, modalAccount.priceUsdText)}`,
                    ] : []),
                    `${t(lang, "wa_sumber")} ${t(lang, SOURCE_LABEL[modalAccount.source] || "src_own")}`,
                  ].join("\n")
                )}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-500 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                {t(lang, "beli_wa")}
              </a>

              <button
                onClick={() => setModalAccount(null)}
                className="w-full mt-2 py-2.5 bg-[var(--surface-alt)] text-sm rounded-xl hover:bg-[var(--surface-hover)] text-[var(--text-muted)] transition-colors"
              >
                {t(lang, "tutup")}
              </button>
            </div>
          </div>
        )}

        {/* Form add/edit akun (admin) */}
        {showForm && (
          <div role="dialog" aria-modal="true" aria-label={editingAccount ? `Edit akun ${editingAccount.code}` : "Tambah akun"} className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto p-4" onClick={() => setShowForm(false)}>
            <div className="bg-[var(--surface)] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto my-auto p-6 pt-2 border border-[var(--border)] shadow-2xl animate-[scaleIn_0.15s_ease-out]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-5">
                <h2 className="text-xl font-bold font-[family-name:var(--font-rubik)] text-[var(--accent)]">{editingAccount ? `${t(lang, "edit_akun")} ${editingAccount.code}` : t(lang, "tambah_akun")}</h2>
                <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors p-1 rounded-xl hover:bg-[var(--surface-alt)]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleSubmitAccount} className="grid grid-cols-2 gap-4">
                <input className="col-span-2 px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" placeholder={t(lang, "ph_kode")} value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                <select className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)]" value={form.server}
                  onChange={(e) => setForm({ ...form, server: e.target.value })}>
                  {SERVERS.map((s) => <option key={s.key} value={s.label}>{t(lang, SERVER_LABEL_KEY[s.key])}</option>)}
                </select>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">{t(lang, "char_extreme_form")}</label>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => prev.randomCount > 0 ? { ...prev, randomCount: 0, characters: [] } : { ...prev, randomCount: 1, characters: [] })}
                      title="Random"
                      aria-pressed={form.randomCount > 0}
                      className={`flex flex-col items-center gap-0.5 p-0.5 rounded-xl border-2 transition-all ${form.randomCount > 0 ? "border-[var(--accent)] bg-[var(--accent-dim)]" : "border-transparent hover:border-[var(--border)] opacity-70 hover:opacity-100"}`}
                    >
                      <img src={RANDOM_IMG} alt="Random" className="w-full aspect-[4/3] object-cover rounded-lg" />
                      <span className="text-[9px] leading-tight text-[var(--text-muted)] truncate w-full text-center">{t(lang, "random")}</span>
                    </button>
                    {CHARACTERS.map((key) => {
                      const selected = form.characters.includes(key);
                      const blocked = form.randomCount > 0 || (!selected && form.characters.length >= 2);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm((prev) => form.randomCount > 0 ? prev : selected ? { ...prev, characters: prev.characters.filter((c) => c !== key) } : blocked ? prev : { ...prev, characters: [...prev.characters, key] })}
                          title={key}
                          aria-pressed={selected}
                          className={`flex flex-col items-center gap-0.5 p-0.5 rounded-xl border-2 transition-all ${selected ? "border-[var(--accent)] bg-[var(--accent-dim)]" : blocked ? "opacity-30 cursor-not-allowed" : "border-transparent hover:border-[var(--border)] opacity-70 hover:opacity-100"}`}
                        >
                          <img src={CHAR_IMAGE[key]} alt={key} className="w-full aspect-[4/3] object-cover rounded-lg" />
                          <span className="text-[9px] leading-tight text-[var(--text-muted)] truncate w-full text-center">{key}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {form.randomCount > 0 && (
                      <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        {t(lang, "berapa_random")}:
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={form.randomCount}
                          onChange={(e) => setForm((prev) => ({ ...prev, randomCount: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)) }))}
                          className="w-16 px-2 py-1 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)]"
                        />
                      </label>
                    )}
                    {form.randomCount === 0 && form.characters.length >= 2 && <p className="text-xs text-[var(--accent)]">{t(lang, "max_2_char_form")}</p>}
                    {form.characters.length > 0 && (
                      <button type="button" className="text-xs text-[var(--red)] hover:underline" onClick={() => setForm((prev) => ({ ...prev, characters: [] }))}>{t(lang, "hapus_semua")} ({form.characters.length})</button>
                    )}
                  </div>
                </div>
                <input className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" type="text" inputMode="numeric" placeholder={t(lang, "ph_diamond")} value={form.diamondsText}
                  onChange={(e) => setForm({ ...form, diamondsText: e.target.value })} />
                <input className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" type="text" inputMode="numeric" placeholder={t(lang, "ph_fragment")} value={form.fragmentsText}
                  onChange={(e) => setForm({ ...form, fragmentsText: e.target.value })} />
                <input className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" type="text" inputMode="text" placeholder={t(lang, "ph_star6")} value={form.char6 || ""}
                  onChange={(e) => setForm({ ...form, char6: e.target.value })} />
                <input className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" type="number" placeholder={t(lang, "ph_harga_rp")} value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
                <input className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] placeholder-[var(--text-muted)]" type="text" inputMode="decimal" placeholder={t(lang, "ph_harga_usd")} value={form.priceUsdText || ""}
                  onChange={(e) => setForm({ ...form, priceUsdText: e.target.value })} />
                <select className="px-3 py-2.5 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)]" value={form.loginVia}
                  onChange={(e) => setForm({ ...form, loginVia: e.target.value })}>
                  <option value="Transfer ID (TF ID)">{t(lang, "login_tf")}</option>
                  <option value="Bandai Namco">{t(lang, "login_bandai")}</option>
                </select>
                {submitError && (
                  <div className="col-span-2 bg-red-900/30 border border-red-700 rounded-xl p-3 text-sm text-red-400">{submitError}</div>
                )}
                <button type="submit" className="col-span-2 px-3 py-2.5 bg-[var(--accent)] text-[#080e1a] text-sm font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-colors">
                  {editingAccount ? t(lang, "simpan_perubahan") : t(lang, "simpan")}
                </button>
              </form>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div role="dialog" aria-modal="true" aria-label="Konfirmasi hapus" className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[var(--text)] mb-2">{t(lang, "hapus_akun")}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {t(lang, "yakin_hapus")} <code className="text-[var(--text)] font-mono">{deleteTarget.code}</code>? {t(lang, "tdk_bisa_batal")}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
                >
                  {t(lang, "batal")}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  {t(lang, "hapus")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
