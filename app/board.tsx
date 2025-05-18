"use client";

// Please excuse the following code!
// This is not meant to be consumed by humans and is merely a result of
// vibe coding and a tight deadline 😅

import { useOptimistic, startTransition } from "react";
import type { Column } from "./backend-stuff/get-columns";

interface Props {
  columns: Array<Column>;
  onCardMove: (moveEvent: { cardId: string; moveTo: number }) => void;
  optimistic?: boolean;
}

export function Board({ columns, onCardMove, optimistic = false }: Props) {
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns);

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
      setOptimisticColumns((currentColumns) => {
        const card = currentColumns
          .flatMap((col) => col.cards)
          .find((card) => card.id === cardId);
        return currentColumns.map((col, index) => {
          const newCards = col.cards.filter((card) => card.id !== cardId);
          if (index === targetColumnIndex) {
            newCards.push(card!);
          }
          return {
            ...col,
            cards: newCards,
          };
        });
      });
    });
    onCardMove({ cardId, moveTo: targetColumnIndex });
  };

  const displayColumns = optimistic ? optimisticColumns : columns;

  const isCardPositionOptimistic = (cardId: string) => {
    // Find the card's position in the actual columns
    const actualColumnIndex = columns.findIndex((col) =>
      col.cards.some((card) => card.id === cardId)
    );

    // Find the card's position in the optimistic columns
    const optimisticColumnIndex = optimisticColumns.findIndex((col) =>
      col.cards.some((card) => card.id === cardId)
    );

    // Card is in an optimistic state if its position in the optimistic columns
    // is different from its position in the actual columns
    return actualColumnIndex !== optimisticColumnIndex;
  };

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
                  isCardPositionOptimistic(card.id)
                    ? "bg-amber-200"
                    : "bg-white"
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
