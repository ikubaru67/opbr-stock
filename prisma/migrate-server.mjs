// Migrasi server+os — 1x jalan. "Global" → "Global Server Android", "JP" → "Japan Server Android"
// Jika sudah ada label lengkap (4 opsi) → skip. OS diisi turunan label.
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const FULL_LABEL: Record<string, string> = {
  "Global": "Global Server Android",
  "JP": "Japan Server Android",
  "Global Server Android": "Global Server Android",
  "Global Server IOS": "Global Server IOS",
  "Japan Server Android": "Japan Server Android",
  "Japan Server IOS": "Japan Server IOS",
};

async function main() {
  const base = new URL(".", import.meta.url).pathname;
  const { PrismaClient } = await import(base + "../src/generated/prisma/client.ts");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) { console.error("DATABASE_URL not set"); process.exit(1); }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  // Ambil semua akun own
  const accounts = await prisma.account.findMany({ where: { source: "own" } });
  console.log(`Migrating ${accounts.length} accounts...`);

  let updated = 0;
  for (const acc of accounts) {
    const newServer = FULL_LABEL[acc.server];
    const os = acc.server?.includes("IOS") ? "IOS" : "Android";
    if (!newServer || (newServer === acc.server && os === acc.os)) continue;
    await prisma.account.update({
      where: { id: acc.id },
      data: { server: newServer, os },
    });
    updated++;
  }

  console.log(`Updated ${updated} accounts. Done!`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });