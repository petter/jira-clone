"use client";

// Please excuse the following code!
// This is not meant to be consumed by humans and is merely a result of
// vibe coding and a tight deadline 😅

import { useOptimistic, useTransition } from "react";
import type { Column } from "../api/get-columns/get-columns";
import type { Card } from "../backend-stuff/db";

interface Props {
  columns: Array<Column>;
  onCardMove: (moveEvent: { cardId: string; moveTo: number }) => void;
  optimistic?: boolean;
}
interface OptimisticColumn extends Column {
  cards: Array<Card & { isOptimistic?: boolean }>;
}

interface OptimisticEvent {
  cardId: string;
  moveTo: number;
}

export function Board({ columns, onCardMove, optimistic = false }: Props) {
  const [, startTransition] = useTransition();
  const [optimisticColumns, addOptimisticEvent] = useOptimistic(
    columns,
    optimisticReducer
  );

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnIndex: number) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");

    // Create optimistic update by moving the card in the local state
    startTransition(() => {
      addOptimisticEvent({ cardId, moveTo: targetColumnIndex });
      onCardMove({ cardId, moveTo: targetColumnIndex });
    });
  };

  const displayColumns: Array<OptimisticColumn> = optimistic
    ? optimisticColumns
    : columns;

  return (
    <div className="flex gap-4 h-[80vh]">
      {displayColumns.map((column, colIndex) => (
        <div
          key={colIndex}
          className="flex flex-col gap-2 bg-slate-200 p-2 max-w-64 w-full h-full rounded"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, colIndex)}
        >
          <h2 className="text-lg font-bold">{column.name}</h2>
          {[...column.cards]
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((card) => (
              <div
                key={card.id}
                className={`rounded-md p-2 text-start cursor-move ${
                  card.isOptimistic ? "bg-amber-200" : "bg-white"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
              >
                {card.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
function optimisticReducer(
  currentColumns: Array<OptimisticColumn>,
  optimisticEvent: OptimisticEvent
): Array<OptimisticColumn> {
  const card = currentColumns
    .flatMap((col) => col.cards)
    .find((card) => card.id === optimisticEvent.cardId);

  if (!card) {
    return currentColumns;
  }

  return currentColumns.map((col, index) => {
    const newCards = col.cards.filter(
      (card) => card.id !== optimisticEvent.cardId
    );
    if (index === optimisticEvent.moveTo) {
      newCards.push({ ...card, isOptimistic: true });
    }
    return {
      ...col,
      cards: newCards,
    };
  });
}
