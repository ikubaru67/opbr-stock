export type ServerKey = "android_global" | "ios_global" | "android_jp" | "ios_jp";

export const SERVERS: { key: ServerKey; label: string; short: string; color: string; shokanCodes: string[]; opbrName: string }[] = [
  { key: "android_global", label: "Global Server Android", short: "Global", color: "green", shokanCodes: ["A-11"], opbrName: "international" },
  { key: "ios_global", label: "Global Server IOS", short: "Global", color: "blue", shokanCodes: ["A-10"], opbrName: "international" },
  { key: "android_jp", label: "Japan Server Android", short: "JP", color: "amber", shokanCodes: ["A-13"], opbrName: "japan" },
  { key: "ios_jp", label: "Japan Server IOS", short: "JP", color: "red", shokanCodes: ["A-12"], opbrName: "japan" },
];

/** Map short/legacy → full label (4 opsi). Gunakan utk form backend & filter DB */
const FULL_SERVER_LABEL: Record<string, string> = {
  "Global": "Global Server Android",
  "JP": "Japan Server Android",
  "Global Server Android": "Global Server Android",
  "Global Server IOS": "Global Server IOS",
  "Japan Server Android": "Japan Server Android",
  "Japan Server IOS": "Japan Server IOS",
};
export type CharKey =
  | "Light WhiteBeard" | "Nika V1" | "Nika V2" | "Zoro Onigashima"
  | "Shanks RED" | "Kizaru" | "Yamato Ace" | "Law Kid" | "Dark Roger"
  | "Green Roger" | "Shanks Kamusari" | "Blue Luffy Ex Anniversary"
  | "Kaido Hybrid Runner" | "Yamato V1" | "Yamato V2" | "Blue Kaido Defender"
  | "S-Snake" | "Garp" | "Rob Lucci" | "Kuzan" | "Sabo" | "Blue Shanks"
  | "Oden" | "Akainu" | "Blue Bigmom Runner" | "BlackBeard V1" | "BlackBeard V2"
  | "Bigmom Onigashima" | "Saturn" | "Nusjuro" | "Law Runner" | "Zoro Sanji"
  | "Zephyr" | "Mars" | "Bonney";

export const CHARACTERS: CharKey[] = [
  "Light WhiteBeard", "Nika V1", "Nika V2", "Zoro Onigashima",
  "Shanks RED", "Kizaru", "Yamato Ace", "Law Kid", "Dark Roger",
  "Green Roger", "Shanks Kamusari", "Blue Luffy Ex Anniversary",
  "Kaido Hybrid Runner", "Yamato V1", "Yamato V2", "Blue Kaido Defender",
  "S-Snake", "Garp", "Rob Lucci", "Kuzan", "Sabo", "Blue Shanks",
  "Oden", "Akainu", "Blue Bigmom Runner", "BlackBeard V1", "BlackBeard V2",
  "Bigmom Onigashima", "Saturn", "Nusjuro", "Law Runner", "Zoro Sanji",
  "Zephyr", "Mars", "Bonney",
];

export const CHAR_IMAGE: Record<CharKey, string> = {
  "Zoro Sanji": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755595/Zoro_Sanji_ho4twc.png",
  "Zoro Onigashima": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755595/Zoro_Onigashima_pfqi2y.png",
  "Yamato V1": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755594/Yamato_V1_jpq5ix.png",
  "Yamato V2": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755595/Yamato_V2_bdks5e.png",
  "Yamato Ace": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755594/Yamato_Ace_pweivk.png",
  "S-Snake": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755593/S-Snake_ciheo9.png",
  "Shanks RED": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755593/Shanks_RED_ticou4.png",
  "Shanks Kamusari": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755592/Shanks_Kamusari_crjjgu.png",
  Saturn: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755592/Saturn_aplazs.png",
  Sabo: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755592/Sabo_i0uuny.png",
  "Rob Lucci": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755591/Rob_Lucci_tp42si.png",
  Oden: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755590/Oden_q0xbo2.png",
  Nusjuro: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755589/Nusjuro_clry8e.png",
  "Nika V2": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755589/Nika_V2_xitg71.png",
  "Nika V1": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755589/Nika_V1_bljhmc.png",
  "Light WhiteBeard": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755589/Light_WhiteBeard_kiitpi.png",
  "Law Runner": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755589/Law_Runner_i42xgx.png",
  "Law Kid": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755588/Law_Kid_fhaonb.png",
  "Kaido Hybrid Runner": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755586/Kaido_Hybrid_Runner_bhlvfx.png",
  Kizaru: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755586/Kizaru_nm4uqe.png",
  Kuzan: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755586/Kuzan_qbasdu.png",
  "Bigmom Onigashima": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/BigMom_Onigashima_qdb0jr.png",
  Garp: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/Garp_fp9fvk.png",
  "Green Roger": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/Green_Roger_mf9elp.png",
  "Dark Roger": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/Dark_Roger_afo553.png",
  "Blue Shanks": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/Blue_Shanks_nhjcyx.png",
  "Blue Bigmom Runner": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/Blue_Bigmom_Runner_urqroo.png",
  "BlackBeard V2": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755585/BlackBeard_V2_gzcacf.png",
  Akainu: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/Akainu_ezemek.png",
  "BlackBeard V1": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/BlackBeard_V1_raog6v.png",
  Zephyr: "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/Zephyr_onu9zx.png",
  "Blue Luffy Ex Anniversary": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/Blue_Luffy_Ex_Anniversary_zvbg3s.png",
  "Blue Kaido Defender": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1783755584/Blue_Kaido_Defender_voibrg.png",
  "Mars": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1786026557/Mars_ugvtou.png",
  "Bonney": "https://res.cloudinary.com/dx0gg88mk/image/upload/v1787321073/Bonney_rqk3v1.png",
};

export const RANDOM_IMG = "https://res.cloudinary.com/dx0gg88mk/image/upload/v1787050333/perspective-dice-six-faces-random-svgrepo-com_y4auot.png";

export const RAINBOW_DIAMONDS_IMG = "https://res.cloudinary.com/dx0gg88mk/image/upload/v1784135736/Rainbow_Diamonds_dxytvx.png";
export const GOLD_FRAGMENTS_IMG = "https://res.cloudinary.com/dx0gg88mk/image/upload/v1784135736/Gold_Fragments_xj2jks.png";

export const CHAR_TO_SHOKAN: Record<CharKey, string | null> = {
  "Light WhiteBeard": "A-6666",
  "Nika V1": "A-1111",
  "Nika V2": "A-2929",
  "Zoro Onigashima": "A-2222",
  "Shanks RED": "A-3333",
  "Kizaru": "A-3030",
  "Yamato Ace": "A-4444",
  "Law Kid": "A-5555",
  "Dark Roger": "A-7777",
  "Green Roger": "A-1010",
  "Shanks Kamusari": "A-8888",
  "Blue Luffy Ex Anniversary": "A-1212",
  "Kaido Hybrid Runner": "A-1313",
  "Yamato V1": "A-1414",
  "Yamato V2": "A-1616",
  "Blue Kaido Defender": "A-1515",
  "S-Snake": "A-1717",
  "Garp": "A-1818",
  "Rob Lucci": "A-1919",
  "Kuzan": "A-2020",
  "Sabo": "A-2121",
  "Blue Shanks": "A-2323",
  "Oden": "A-2525",
  "Akainu": "A-2424",
  "Blue Bigmom Runner": "A-2727",
  "BlackBeard V1": "A-2626",
  "BlackBeard V2": "A-3131",
  "Bigmom Onigashima": "A-2828",
  "Saturn": "A-3232",
  "Nusjuro": "A-3434",
  "Law Runner": "A-3535",
  "Zoro Sanji": "A-3636",
  "Zephyr": null,
  "Mars": "A-3737",
  "Bonney": null,
};

export const CHAR_TO_CN: Record<CharKey, string> = {
  "Light WhiteBeard": "白胡子",
  "Nika V1": "尼卡鲁夫",
  "Nika V2": "白尼卡",
  "Zoro Onigashima": "鬼島索隆",
  "Shanks RED": "绿红发",
  "Kizaru": "黄猿",
  "Yamato Ace": "艾斯&大和",
  "Law Kid": "基德&羅",
  "Dark Roger": "黑罗杰",
  "Green Roger": "老罗杰",
  "Shanks Kamusari": "白红发",
  "Blue Luffy Ex Anniversary": "鲁夫",
  "Kaido Hybrid Runner": "凯多",
  "Yamato V1": "大和",
  "Yamato V2": "大口真神大和",
  "Blue Kaido Defender": "海道",
  "S-Snake": "女帝",
  "Garp": "卡普",
  "Rob Lucci": "罗布",
  "Kuzan": "青雉",
  "Sabo": "萨波",
  "Blue Shanks": "蓝红发",
  "Oden": "御田",
  "Akainu": "赤犬",
  "Blue Bigmom Runner": "大妈",
  "BlackBeard V2": "黑胡子",
  "BlackBeard V1": "新黑胡子",
  "Bigmom Onigashima": "和服大妈",
  "Saturn": "萨坦",
  "Nusjuro": "马骨",
  "Law Runner": "红罗",
  "Zoro Sanji": "双翼",
  "Zephyr": "泽法",
  "Mars": "火星",
  "Bonney": "波妮",
};

const CN_TO_CHAR: Record<string, CharKey> = {};
for (const [eng, cn] of Object.entries(CHAR_TO_CN)) {
  CN_TO_CHAR[cn] = eng as CharKey;
}
CN_TO_CHAR["5档路飞"] = "Nika V2";
CN_TO_CHAR["海道"] = "Blue Kaido Defender";
CN_TO_CHAR["女帝"] = "S-Snake";
CN_TO_CHAR["萨波"] = "Sabo";
CN_TO_CHAR["御田"] = "Oden";
CN_TO_CHAR["萨坦"] = "Saturn";
CN_TO_CHAR["马骨"] = "Nusjuro";
CN_TO_CHAR["红罗"] = "Law Runner";
CN_TO_CHAR["双翼"] = "Zoro Sanji";
CN_TO_CHAR["白胡子"] = "Light WhiteBeard";
CN_TO_CHAR["路奇"] = "Rob Lucci";
CN_TO_CHAR["青稚"] = "Kuzan";
CN_TO_CHAR["绿紅發"] = "Shanks RED";
CN_TO_CHAR["索隆&山治"] = "Zoro Sanji";
CN_TO_CHAR["新黑胡子"] = "BlackBeard V2";
CN_TO_CHAR["蓝凯多"] = "Blue Kaido Defender";
CN_TO_CHAR["S蛇"] = "S-Snake";
CN_TO_CHAR["萨博"] = "Sabo";
CN_TO_CHAR["五老星萨图"] = "Saturn";
CN_TO_CHAR["罗"] = "Law Runner";
CN_TO_CHAR["月光御田"] = "Oden";
CN_TO_CHAR["五老星"] = "Nusjuro";
CN_TO_CHAR["黑胡子"] = "BlackBeard V2";
CN_TO_CHAR["蛇鸟"] = "Mars"; // vendor pakai nama ini untuk Mars (bukan 火星)

// Nama (EN + CN) dari semua karakter EX — buat filter "Ada/Tanpa Extreme" di DB.
// DB akun opbr simpan CN names, akun own dari form admin simpan CharKey English.
export const EX_CHAR_NAMES: string[] = Array.from(
  new Set([...Object.keys(CN_TO_CHAR), ...Object.values(CHAR_TO_CN), ...CHARACTERS])
);

const SHOKAN_TO_CHAR: Record<string, CharKey> = {};
for (const [eng, code] of Object.entries(CHAR_TO_SHOKAN)) {
  if (code) SHOKAN_TO_CHAR[code] = eng as CharKey;
}

const SERVER_CODES = new Set(["A-10", "A-11", "A-12", "A-13"]);

export function parseShokanRoles(rolesStr: string): CharKey[] {
  return rolesStr.split(",")
    .map((r) => r.trim())
    .filter((r) => r && !SERVER_CODES.has(r))
    .map((r) => SHOKAN_TO_CHAR[r])
    .filter((c): c is CharKey => !!c);
}

export function parseOpbrChars(charsStr: string): CharKey[] {
  return charsStr.split("-")
    .map((c) => CN_TO_CHAR[c.trim()])
    .filter((c): c is CharKey => !!c);
}

export function buildShokanRoles(servers: ServerKey[], characters: CharKey[]): string {
  const codes: string[] = [];
  for (const s of servers) {
    const sv = SERVERS.find((v) => v.key === s);
    if (sv) codes.push(...sv.shokanCodes);
  }
  for (const c of characters) {
    const code = CHAR_TO_SHOKAN[c];
    if (code) codes.push(code);
  }
  return codes.join(",");
}

export function buildOpbrChars(characters: CharKey[]): string {
  const names = characters.map((c) => CHAR_TO_CN[c]).filter(Boolean);
  return names.join("-");
}

export function getOpbrServer(servers: ServerKey[]): string {
  if (servers.length === 0) return "international";
  const sv = SERVERS.find((s) => s.key === servers[0]);
  return sv?.opbrName || "international";
}

export function getServerLabel(servers: ServerKey[]): string {
  if (servers.length === 0) return "Global";
  const sv = SERVERS.find((s) => s.key === servers[0]);
  return sv?.short || "Global";
}

export function detectServerLabel(rolesStr: string): string {
  const codes = rolesStr.split(",").map((r) => r.trim());
  for (const sv of SERVERS) {
    if (sv.shokanCodes.some((code) => codes.includes(code))) return sv.short;
  }
  return "Global";
}

export function detectServerFullLabel(rolesStr: string): string {
  const codes = rolesStr.split(",").map((r) => r.trim());
  for (const sv of SERVERS) {
    if (sv.shokanCodes.some((code) => codes.includes(code))) return sv.label;
  }
  return "Global Server Android";
}

export function getServerFullLabel(servers: ServerKey[]): string {
  if (servers.length === 0) return "Global Server Android";
  const sv = SERVERS.find((s) => s.key === servers[0]);
  return sv?.label || "Global Server Android";
}

export function matchServerCodes(rolesStr: string, serverCodes: string[]): boolean {
  const codes = rolesStr.split(",").map((r) => r.trim());
  return serverCodes.some((sc) => codes.includes(sc));
}

export function hasShokanCode(charName: string): boolean {
  return !!CHAR_TO_SHOKAN[charName as CharKey];
}

export function parseApiChars(chineseNames: string[]): CharKey[] {
  const result: CharKey[] = [];
  for (const cn of chineseNames) {
    const eng = CN_TO_CHAR[cn];
    if (eng) result.push(eng);
  }
  return result;
}

export interface ApiChar { key: string; hasMapping: boolean; }

export function getApiCharacters(list: { name: string }[]): ApiChar[] {
  return list.map(({ name }) => {
    const known = CN_TO_CHAR[name];
    return known ? { key: known, hasMapping: true } : { key: name, hasMapping: false };
  });
}

export function buildOpbrCharsAny(chars: string[]): string {
  return chars.map((c) => {
    if (c === "Mars") return "蛇鸟"; // API vendor pakai 蛇鸟 untuk Mars
    return CHAR_TO_CN[c as CharKey] ?? c;
  }).join("-");
}

export function detectServerColor(rolesStr: string): string {
  const codes = rolesStr.split(",").map((r) => r.trim());
  for (const sv of SERVERS) {
    if (sv.shokanCodes.some((code) => codes.includes(code))) return sv.color;
  }
  return "green";
}

export function getServerColor(servers: ServerKey[]): string {
  if (servers.length === 0) return "green";
  const sv = SERVERS.find((s) => s.key === servers[0]);
  return sv?.color || "green";
}

const LABEL_TO_COLOR: Record<string, string> = {
  "Global Server Android": "green",
  "Global Server IOS": "blue",
  "Japan Server Android": "amber",
  "Japan Server IOS": "red",
  "Global": "green",
  "JP": "amber",
};

export function serverColorFromLabel(label: string): string {
  return LABEL_TO_COLOR[label] || "green";
}

export interface ProxyAccount {
  id?: string;
  code: string;
  server: string;
  characters: CharKey[];
  diamonds: number;
  fragments: number;
  diamondsText?: string;
  fragmentsText?: string;
  source: "own" | "customv1" | "customv2";
  char6?: string;
  price?: number;
  priceUsd?: number;
  priceUsdText?: string;
  os?: string;
  loginVia?: string;
  randomCount?: number;
}

export type SortBy = "diamonds" | "fragments" | "code" | "extreme";
export type SortOrder = "asc" | "desc";

/** Jumlah karakter extreme: randomCount (akun random) atau hitungan char di EX_CHAR_NAMES */
export function extremeCount(a: ProxyAccount): number {
  if ((a.randomCount ?? 0) > 0) return a.randomCount as number;
  return (a.characters || []).filter((c) => EX_CHAR_NAMES.includes(c as string)).length;
}

export function sortAccounts(accounts: ProxyAccount[], sortBy?: SortBy, sortOrder?: SortOrder): ProxyAccount[] {
  if (!sortBy) return accounts;
  return [...accounts].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "diamonds") cmp = a.diamonds - b.diamonds;
    else if (sortBy === "fragments") cmp = a.fragments - b.fragments;
    else if (sortBy === "extreme") cmp = extremeCount(a) - extremeCount(b);
    else cmp = a.code.localeCompare(b.code);
    return sortOrder === "asc" ? cmp : -cmp;
  });
}

export interface AccountForm {
  code: string;
  server: string;
  characters: CharKey[];
  diamonds: number;
  fragments: number;
  diamondsText: string;
  fragmentsText: string;
  price: number;
  priceUsd: number;
  priceUsdText: string;
  char6: string;
  os: string;
  loginVia: string;
  randomCount: number;
}

/** Ambil angka pertama dari "3000-3500" → 3000; fallback 0 */
function parseIntOrZero(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
  const m = String(raw ?? "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

/** "0.70" → 70 sen; kosong/gagal → 0 */
function parseUsdCents(raw: unknown): number {
  const m = String(raw ?? "").trim().match(/\d+(?:\.\d+)?/);
  if (!m) return 0;
  return Math.round(parseFloat(m[0]) * 100);
}

/** Form → payload API. Text disimpan mentah, Int diisi nilai bawah utk sort/filter */
export function accountToPayload(f: AccountForm) {
  return {
    code: f.code.trim(),
    server: f.server,
    characters: f.characters.filter((c): c is CharKey => c in CHAR_IMAGE),
    diamonds: parseIntOrZero(f.diamondsText) || parseIntOrZero(f.diamonds),
    fragments: parseIntOrZero(f.fragmentsText) || parseIntOrZero(f.fragments),
    diamondsText: String(f.diamondsText ?? "").trim(),
    fragmentsText: String(f.fragmentsText ?? "").trim(),
    price: parseIntOrZero(f.price),
    priceUsd: parseUsdCents(f.priceUsdText),
    priceUsdText: String(f.priceUsdText ?? "").trim(),
    char6: String(f.char6 ?? "").trim(),
    os: f.server.includes("IOS") ? "IOS" : "Android",
    loginVia: f.loginVia,
    randomCount: Math.min(10, Math.max(0, parseIntOrZero(f.randomCount))),
  };
}

export function formFromAccount(a: ProxyAccount): AccountForm {
  return {
    code: a.code,
    server: (FULL_SERVER_LABEL[a.server] ?? a.server) || "Global Server Android",
    characters: (a.characters || []).filter((c): c is CharKey => c in CHAR_IMAGE),
    diamonds: a.diamonds || 0,
    fragments: a.fragments || 0,
    diamondsText: a.diamondsText ? String(a.diamondsText) : (a.diamonds ? String(a.diamonds) : ""),
    fragmentsText: a.fragmentsText ? String(a.fragmentsText) : (a.fragments ? String(a.fragments) : ""),
    price: a.price || 0,
    priceUsd: a.priceUsd || 0,
    priceUsdText: a.priceUsdText ? String(a.priceUsdText) : (a.priceUsd ? String(a.priceUsd) : ""),
    char6: String(a.char6 ?? ""),
    os: (a.server ?? "").includes("IOS") ? "IOS" : "Android",
    loginVia: a.loginVia || "Transfer ID (TF ID)",
    randomCount: (a as any).randomCount || 0,
  };
}

/** "Rp300.000" — 0/nil → string kosong */
export function formatIDR(n: number | undefined | null): string {
  if (!n) return "";
  return `Rp${n.toLocaleString("id-ID")}`;
}

/** "$99" — 0/nil → string kosong */
export function formatUSD(n: number | undefined | null): string {
  if (!n) return "";
  return `$${n.toLocaleString("en-US")}`;
}

/** "$0.70" / "$99" dari text; fallback "$99" dari Int dollars lama; 0 → "" */
export function formatUsdDisplay(int?: number, text?: string): string {
  if (text && text.trim()) return `$${text.trim()}`;
  if (int) return `$${int.toLocaleString("en-US")}`;
  return "";
}
