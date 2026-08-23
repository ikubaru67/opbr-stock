"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { formatIDR, formatUsdDisplay } from "@/lib/mapping";
import { t } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

interface Account {
  id: string;
  code: string;
  server: string;
  characters: string[];
  diamonds: number;
  fragments: number;
  diamondsText?: string;
  fragmentsText?: string;
  price: number;
  priceUsd?: number;
  priceUsdText?: string;
  source: string;
  status: string;
  os: string;
  loginVia: string;
  randomCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AccountDetail() {
  const { code } = useParams<{ code: string }>();
  const { lang, setLang } = useLang();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/accounts/${code}`)
      .then((r) => r.json())
      .then(setAccount)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <div className="text-center py-12 text-[var(--text-muted)]">{t(lang, "memuat_detail")}</div>;
  if (!account) return <div className="text-center py-12 text-[var(--text-muted)]">{t(lang, "tdk_ditemukan")}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <a href="/" className="text-sm text-[var(--accent)] hover:underline inline-block">← {t(lang, "kembali")}</a>
        <div className="inline-flex items-center gap-2">
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
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold font-mono">{account.code}</h1>
            <span className={`text-sm px-2 py-0.5 rounded-full ${account.server === "JP" ? "bg-red-900/40 text-red-400" : "bg-blue-900/40 text-blue-400"}`}>
              {account.server}
            </span>
          </div>
          <span className={`text-sm px-2 py-1 rounded-full ${account.status === "available" ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}>
            {account.status === "available" ? t(lang, "tersedia") : t(lang, "terjual")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[var(--surface-alt)] p-3 rounded-lg">
            <div className="text-[var(--text-muted)]">{t(lang, "diamond_label")}</div>
            <div className="text-lg font-semibold">{account.diamondsText || account.diamonds.toLocaleString()}</div>
          </div>
          <div className="bg-[var(--surface-alt)] p-3 rounded-lg">
            <div className="text-[var(--text-muted)]">{t(lang, "gf_label")}</div>
            <div className="text-lg font-semibold">{account.fragmentsText || account.fragments.toLocaleString()}</div>
          </div>
          {(account.price > 0 || (account.priceUsd ?? 0) > 0) && (
            <div className="col-span-2 bg-[var(--surface-alt)] p-3 rounded-lg">
              <div className="text-[var(--text-muted)]">{t(lang, "harga_label")}</div>
              <div className="text-lg font-semibold">
                {formatIDR(account.price)}
                {(account.priceUsd ?? 0) > 0 && <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">/ {formatUsdDisplay(account.priceUsd, account.priceUsdText)}</span>}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">{t(lang, "karakter_extreme")} ({(account.randomCount ?? 0) > 0 ? account.randomCount : account.characters.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {account.characters.map((ch) => (
              <span key={ch} className="text-sm bg-[var(--surface-alt)] px-2 py-1 rounded text-[var(--text)]">{ch}</span>
            ))}
          </div>
        </div>

        <div className="text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-4 space-y-1">
          <div>{t(lang, "sumber")}: {account.source === "own" ? t(lang, "src_own") : account.source === "customv1" ? t(lang, "src_v1") : t(lang, "src_v2")}</div>
          <div>{t(lang, "ditambahkan")}: {new Date(account.createdAt).toLocaleDateString("id-ID")}</div>
          <div>{t(lang, "terakhir_update")}: {new Date(account.updatedAt).toLocaleDateString("id-ID")}</div>
          {account.os && <div>{t(lang, "os")}: {account.os}</div>}
          {account.loginVia && <div>{t(lang, "login")}: {account.loginVia}</div>}
        </div>
      </div>
    </div>
  );
}
