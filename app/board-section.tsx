"use client";

import { startTransition } from "react";
import { Board } from "./components/board";
import { moveCardAction } from "./move-card-action";
import type { Column } from "./api/get-columns/get-columns";
import type { MoveEvent } from "./backend-stuff/move-card";

interface Props {
  columns: Array<Column>;
}

export function BoardSection({ columns }: Props) {
  async function moveCard(moveEvent: MoveEvent) {
    // Move cards
    await moveCardAction(moveEvent);
  }

  return (
    <Board
      columns={columns}
      onCardMove={(e) => {
        startTransition(() => moveCard(e));
      }}
      optimistic
    />
  );
}
