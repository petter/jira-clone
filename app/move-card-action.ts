"use server";

import { moveCard, type MoveEvent } from "./backend-stuff/move-card";

export async function moveCardAction({ cardId, moveTo }: MoveEvent) {
  await moveCard(cardId, moveTo);
}
