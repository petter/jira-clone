import { moveCard } from "@/app/backend-stuff/move-card";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const moveEvent = await request.json();
  await moveCard(moveEvent.cardId, moveEvent.moveTo);
  return NextResponse.json({ success: true });
}
