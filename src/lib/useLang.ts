"use client";
import { useState, useEffect } from "react";
import type { Lang } from "./i18n";

export function useLang() {
  const [lang, setLangState] = useState<Lang>("id");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "id" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    try { localStorage.setItem("lang", l); } catch {}
    setLangState(l);
  };

  return { lang, setLang };
}
