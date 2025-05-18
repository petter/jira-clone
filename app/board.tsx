"use client";

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

    if (optimistic) {
      // Create optimistic update by moving the card in the local state
      startTransition(() => {
        setOptimisticColumns((currentColumns) => {
          const newColumns = [...currentColumns];
          // Find the source column and card
          const sourceColumnIndex = newColumns.findIndex((col) =>
            col.cards.some((card) => card.id === cardId)
          );
          if (sourceColumnIndex === -1) return currentColumns;

          const sourceColumn = newColumns[sourceColumnIndex];
          const cardIndex = sourceColumn.cards.findIndex(
            (card) => card.id === cardId
          );
          if (cardIndex === -1) return currentColumns;

          // Remove card from source column
          const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
          // Add card to target column
          newColumns[targetColumnIndex].cards.push(movedCard);

          return newColumns;
        });
      });
    }

    onCardMove({ cardId, moveTo: targetColumnIndex });
  };

  const displayColumns = optimistic ? optimisticColumns : columns;

  return (
    <div className="flex gap-4 h-[80vh]">
      {displayColumns.map((column, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 bg-slate-200 p-2 max-w-64 w-full h-full rounded"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <h2 className="text-lg font-bold">{column.name}</h2>
          {column.cards.map((card) => (
            <button
              key={card.id}
              className="rounded-md bg-white p-2 focus:bg-green-100 text-start cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  if (index < columns.length - 1) {
                    onCardMove({ cardId: card.id, moveTo: index + 1 });
                  }
                } else if (e.key === "ArrowLeft") {
                  if (index > 0) {
                    onCardMove({ cardId: card.id, moveTo: index - 1 });
                  }
                }
              }}
            >
              {card.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
