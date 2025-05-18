import { getColumns } from "@/app/backend-stuff/get-columns";
import { NextResponse } from "next/server";

export async function GET() {
  const columns = await getColumns();
  return NextResponse.json(columns);
}
