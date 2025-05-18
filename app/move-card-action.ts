"use server";

import { moveCard, type MoveEvent } from "./backend-stuff/move-card";
import { revalidatePath } from "next/cache";

export async function moveCardAction({ cardId, moveTo }: MoveEvent) {
  await moveCard(cardId, moveTo);
  revalidatePath("/");
}
