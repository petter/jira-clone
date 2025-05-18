import { db, type Card } from "./db";

const columns = ["To Do", "In Progress", "Done", "Archived"];

export interface Column {
  name: string;
  cards: Card[];
}

export async function getColumns(): Promise<Column[]> {
  const cards = await db.findAll();
  console.log(cards);
  return columns.map((column, colIndex) => ({
    name: column,
    cards: cards.filter((card) => card.column === colIndex),
  }));
}
