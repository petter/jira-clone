import { NextResponse } from "next/server";
import { getColumns } from "./get-columns";

export async function GET() {
  const columns = await getColumns();
  return NextResponse.json(columns);
}
