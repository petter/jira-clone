import { type Card, db } from "@/app/backend-stuff/db";

export interface Column {
  name: string;
  cards: Card[];
}

const columns = ["To Do", "In Progress", "Done", "Archived"];
export async function getColumns() {
  const cards = await db.findAll();
  return columns.map((column, colIndex) => ({
    name: column,
    cards: cards.filter((card) => card.column === colIndex),
  }));
}
