export type Lang = "id" | "en";

type Dict = Record<string, string>;

const ID: Dict = {
  // Tabs & sub-tabs
  ready_stock: "Ready Stock",
  custom_request: "Custom Request",
  tanpa_extreme: "Tanpa Extreme",
  ada_extreme: "Ada Extreme",
  gf_1000_3500: "1000-3500+ GF",
  gf_5600_6400: "5600-6400 GF",
  gf_6400_6800: "6400-6800 GF",
  gf_7800: "7800+ GF",

  // Header
  title: "OPBR Ikubaru - RD Accounts Stock",
  tagline: "One Piece Bounty Rush — Akun Starter Siap Pakai",
  admin_logout: "Admin Mode • Keluar",
  store_name: "Ikubaru Store",
  seller_trusted: "Seller Terpercaya",

  // Filter bar
  server: "Server",
  all_servers: "Semua Server",
  cari_kode: "Cari Kode",
  search_code_ph: "Masukkan kode akun...",
  urutkan: "Urutkan",
  sort_default: "Default",
  diamond_desc: "Diamond ↓",
  diamond_asc: "Diamond ↑",
  gf_desc: "Gold Fragment ↓",
  gf_asc: "Gold Fragment ↑",
  code_asc: "Kode ↑",
  code_desc: "Kode ↓",
  extreme_desc: "Extreme terbanyak",
  extreme_asc: "Extreme tersedikit",
  cari_akun: "Cari Akun",
  memuat: "Memuat...",
  hapus_filter: "Hapus filter",

  // Character picker
  pilih_char: "Pilih Karakter Extreme",
  memuat_char: "Memuat daftar Karakter Extreme...",
  deteksi_gagal: "Deteksi Karakter Extreme otomatis gagal, memakai daftar bawaan",
  random: "Random",
  hapus_semua: "Hapus semua",
  min_2_char_search: "Pilih minimal 2 Karakter Extreme untuk mencari",
  max_2_char_own: "Maksimal 2 Karakter Extreme terpilih",
  err_min_2: "Harus pilih minimal 2 Karakter Extreme terlebih dahulu",

  // Results
  mencari: "Mencari akun...",
  mulai_cari: "Pilih filter dan klik Cari Akun untuk mulai",
  tdk_ada_akun: "Tidak ada akun ditemukan",
  akun_baru: "Akun Baru",
  akun_ditemukan: "akun ditemukan",

  // Table
  kode: "Kode",
  diamond: "Diamond",
  gf: "GF",
  star6_char: "★6 karakter",
  harga: "Harga",
  os: "OS",
  login: "Login",
  aksi: "Aksi",
  edit: "Edit",
  hapus: "Hapus",

  // Pagination
  sebelumnya: "Sebelumnya",
  berikutnya: "Berikutnya",
  halaman: "Halaman",

  // Modal
  diamond_label: "Diamond",
  gf_label: "Gold Fragment",
  harga_label: "Harga",
  karakter_extreme: "Karakter Extreme",
  random_n_char: "Random {n} Karakter Extreme",
  sumber: "Sumber",
  hubungi_admin: "Hubungi admin untuk info harga & pembelian",
  beli_wa: "Beli via WhatsApp",
  tutup: "Tutup",

  // Form
  tambah_akun: "Tambah Akun Baru",
  edit_akun: "Edit Akun",
  char_extreme_form: "Karakter Extreme (maksimal 2)",
  berapa_random: "Berapa karakter random:",
  max_2_char_form: "Maksimal 2 karakter",
  ph_kode: "Kode akun",
  ph_diamond: "Diamond (cth: 3000-3500)",
  ph_fragment: "Fragment (cth: 3000-3500)",
  ph_star6: "★6 karakter (cth: 3-15)",
  ph_harga_rp: "Harga (Rp)",
  ph_harga_usd: "Harga (USD)",
  login_tf: "Login via: Transfer ID (TF ID)",
  login_bandai: "Login via: Bandai Namco",
  err_simpan: "Gagal menyimpan akun",
  simpan: "Simpan",
  simpan_perubahan: "Simpan Perubahan",

  // Delete confirm
  hapus_akun: "Hapus Akun?",
  yakin_hapus: "Yakin ingin menghapus akun",
  tdk_bisa_batal: "Tindakan ini tidak bisa dibatalkan.",
  batal: "Batal",
  err_hapus: "Gagal menghapus akun",

  // Detail page
  memuat_detail: "Memuat...",
  tdk_ditemukan: "Akun tidak ditemukan",
  kembali: "Kembali",
  tersedia: "Tersedia",
  terjual: "Terjual",
  ditambahkan: "Ditambahkan",
  terakhir_update: "Terakhir update",

  // Source labels
  src_own: "Ready Stock",
  src_v1: "1000-3500+ GF",
  src_v2: "Custom Request",

  // Server labels
  server_global_android: "Global Server Android",
  server_global_ios: "Global Server IOS",
  server_jp_android: "Japan Server Android",
  server_jp_ios: "Japan Server IOS",

  // WhatsApp template
  wa_hello: "Halo admin Ikubaru, saya ingin order ini",
  wa_code: "Kode:",
  wa_rd: "RD",
  wa_gf: "GF",
  wa_star6: "★6 Karakter:",
  wa_login: "Login via",
  wa_harga: "Harga:",
  wa_sumber: "Sumber:",
};

const EN: Dict = {
  ready_stock: "Ready Stock",
  custom_request: "Custom Request",
  tanpa_extreme: "No Extreme",
  ada_extreme: "Has Extreme",
  gf_1000_3500: "1000-3500+ GF",
  gf_5600_6400: "5600-6400 GF",
  gf_6400_6800: "6400-6800 GF",
  gf_7800: "7800+ GF",

  title: "OPBR Ikubaru - RD Accounts Stock",
  tagline: "One Piece Bounty Rush — Ready-to-Play Starter Accounts",
  admin_logout: "Admin Mode • Logout",
  store_name: "Ikubaru Store",
  seller_trusted: "Trusted Seller",

  server: "Server",
  all_servers: "All Servers",
  cari_kode: "Search Code",
  search_code_ph: "Enter account code...",
  urutkan: "Sort By",
  sort_default: "Default",
  diamond_desc: "Diamond ↓",
  diamond_asc: "Diamond ↑",
  gf_desc: "Gold Fragment ↓",
  gf_asc: "Gold Fragment ↑",
  code_asc: "Code ↑",
  code_desc: "Code ↓",
  extreme_desc: "Most Extreme",
  extreme_asc: "Least Extreme",
  cari_akun: "Search Accounts",
  memuat: "Loading...",
  hapus_filter: "Clear filter",

  pilih_char: "Select Extreme Characters",
  memuat_char: "Loading Extreme Characters list...",
  deteksi_gagal: "Auto Extreme Character detection failed, using built-in list",
  random: "Random",
  hapus_semua: "Clear all",
  min_2_char_search: "Select at least 2 Extreme Characters to search",
  max_2_char_own: "Maximum 2 Extreme Characters selected",
  err_min_2: "Please select at least 2 Extreme Characters first",

  mencari: "Searching accounts...",
  mulai_cari: "Pick filters and click Search Accounts to start",
  tdk_ada_akun: "No accounts found",
  akun_baru: "New Account",
  akun_ditemukan: "accounts found",

  kode: "Code",
  diamond: "Diamond",
  gf: "GF",
  star6_char: "★6 Characters",
  harga: "Price",
  os: "OS",
  login: "Login",
  aksi: "Action",
  edit: "Edit",
  hapus: "Delete",

  sebelumnya: "Previous",
  berikutnya: "Next",
  halaman: "Page",

  diamond_label: "Diamond",
  gf_label: "Gold Fragment",
  harga_label: "Price",
  karakter_extreme: "Extreme Characters",
  random_n_char: "Random {n} Extreme Characters",
  sumber: "Source",
  hubungi_admin: "Contact admin for price & purchase info",
  beli_wa: "Buy via WhatsApp",
  tutup: "Close",

  tambah_akun: "Add New Account",
  edit_akun: "Edit Account",
  char_extreme_form: "Extreme Characters (max 2)",
  berapa_random: "How many random characters:",
  max_2_char_form: "Maximum 2 characters",
  ph_kode: "Account code",
  ph_diamond: "Diamond (e.g. 3000-3500)",
  ph_fragment: "Fragment (e.g. 3000-3500)",
  ph_star6: "★6 characters (e.g. 3-15)",
  ph_harga_rp: "Price (Rp)",
  ph_harga_usd: "Price (USD)",
  login_tf: "Login via: Transfer ID (TF ID)",
  login_bandai: "Login via: Bandai Namco",
  err_simpan: "Failed to save account",
  simpan: "Save",
  simpan_perubahan: "Save Changes",

  hapus_akun: "Delete Account?",
  yakin_hapus: "Are you sure you want to delete account",
  tdk_bisa_batal: "This action cannot be undone.",
  batal: "Cancel",
  err_hapus: "Failed to delete account",

  memuat_detail: "Loading...",
  tdk_ditemukan: "Account not found",
  kembali: "Back",
  tersedia: "Available",
  terjual: "Sold",
  ditambahkan: "Added",
  terakhir_update: "Last updated",

  src_own: "Ready Stock",
  src_v1: "1000-3500+ GF",
  src_v2: "Custom Request",

  server_global_android: "Global Server (Android)",
  server_global_ios: "Global Server (iOS)",
  server_jp_android: "Japan Server (Android)",
  server_jp_ios: "Japan Server (iOS)",

  wa_hello: "Hello Ikubaru admin, I want to order this",
  wa_code: "Code:",
  wa_rd: "RD",
  wa_gf: "GF",
  wa_star6: "★6 Characters:",
  wa_login: "Login via",
  wa_harga: "Price:",
  wa_sumber: "Source:",
};

export const dicts: Record<Lang, Dict> = { id: ID, en: EN };

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let str = dicts[lang][key] ?? dicts.id[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
