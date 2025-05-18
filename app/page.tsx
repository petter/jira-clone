"use client";

import { useEffect, useState } from "react";

import type { Column } from "./backend-stuff/get-columns";
import { Board } from "./board";

export default function Home() {
  const [columns, setColumns] = useState<Array<Column>>([]);

  useEffect(() => {
    fetch("/api/get-columns")
      .then((res) => res.json())
      .then(setColumns);
  }, []);

  async function moveCard(moveEvent: { cardId: string; moveTo: number }) {
    await fetch("/api/move-card", {
      method: "POST",
      body: JSON.stringify(moveEvent),
    });
    fetch("/api/get-columns")
      .then((res) => res.json())
      .then(setColumns);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Petters Board</h1>
      <p>Trykk på et kort og bruk piltastene for å flytte kortet</p>
      <Board columns={columns} onCardMove={moveCard} optimistic />
    </div>
  );
}
