import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";

neonConfig.webSocketConstructor = ws;

const characters = [
  "Light WhiteBeard", "Nika V1", "Nika V2", "Zoro Onigashima",
  "Shanks RED", "Kizaru", "Yamato Ace", "Law Kid", "Dark Roger",
  "Green Roger", "Shanks Kamusari", "Blue Luffy Ex Anniversary",
  "Kaido Hybrid Runner", "Yamato V1", "Yamato V2", "Blue Kaido Defender",
  "S-Snake", "Garp", "Rob Lucci", "Kuzan", "Sabo", "Blue Shanks",
  "Oden", "Akainu", "Blue Bigmom Runner", "BlackBeard V1", "BlackBeard V2",
  "Bigmom Onigashima", "Saturn", "Nusjuro", "Law Runner", "Zoro Sanji",
  "Zephyr", "Mars",
];

async function main() {
  const base = new URL(".", import.meta.url).pathname;
  const { PrismaClient } = await import(base + "../src/generated/prisma/client.ts");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) { console.error("DATABASE_URL not set"); process.exit(1); }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding characters...");
  for (let i = 0; i < characters.length; i++) {
    const name = characters[i];
    await prisma.character.upsert({
      where: { name },
      update: { sortOrder: i + 1 },
      create: { name, sortOrder: i + 1 },
    });
  }

  console.log("Creating admin user...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  console.log("Seed done!");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e.stack); process.exit(1); });
