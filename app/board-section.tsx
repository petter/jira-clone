"use client";

import { startTransition, useState } from "react";
import { Board } from "./components/board";
import { moveCardAction } from "./move-card-action";
import type { Column } from "./api/get-columns/get-columns";
import type { MoveEvent } from "./backend-stuff/move-card";

interface Props {
  columns: Array<Column>;
}

export function BoardSection({ columns: initialColumns }: Props) {
  const [columns, setColumns] = useState<Array<Column>>(initialColumns);

  async function moveCard(moveEvent: MoveEvent) {
    // Move cards
    await moveCardAction(moveEvent);

    // Update local state after the move is complete
    const updatedColumns = await fetch("/api/get-columns").then((res) =>
      res.json()
    );
    setColumns(updatedColumns);
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
