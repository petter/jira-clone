"use client";

import type { Column } from "./backend-stuff/get-columns";

interface Props {
  columns: Array<Column>;
  onCardMove: (moveEvent: { cardId: string; moveTo: number }) => void;
}

export function Board({ columns, onCardMove }: Props) {
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnIndex: number) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");
    onCardMove({ cardId, moveTo: targetColumnIndex });
  };

  return (
    <div className="flex gap-4 h-[80vh]">
      {columns.map((column, index) => (
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
