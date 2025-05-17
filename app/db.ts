import { promises as fs } from "fs";
import path from "path";

interface Card {
  id: string;
  title: string;
  column: number;
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Initialize the database file if it doesn't exist
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({}));
  }
}

// Read the database
async function readDb(): Promise<Record<string, Card>> {
  await initDb();
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

// Write to the database
async function writeDb(data: Record<string, Card>) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
  async insert(title: string, column: number): Promise<Card["id"]> {
    const data = await readDb();
    const id = Math.random().toString(36).substring(2, 15);
    data[id] = { id, title, column };
    await writeDb(data);
    return id;
  },
  async update(
    id: Card["id"],
    { column, title }: Omit<Card, "id">
  ): Promise<void> {
    const data = await readDb();
    data[id] = { id, title, column };
    await writeDb(data);
  },
  async find(id: Card["id"]): Promise<Card | undefined> {
    const data = await readDb();
    return data[id];
  },
  async findAll(): Promise<Card[]> {
    const data = await readDb();
    return Object.values(data);
  },
};
