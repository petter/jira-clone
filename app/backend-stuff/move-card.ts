// The hidden backend for moving cards on the board.
// This code is meant to simulate the slowness and "randomness" of real-world APIs.

import { db } from "./db";

let moveCount = 0;
export async function moveCard(id: string, to: number): Promise<number> {
  await new Promise((resolve) =>
    setTimeout(resolve, moveCount % 2 === 0 ? 2000 : 6000)
  );
  moveCount++;
  await db.update(id, { column: to });
  return to;
}
