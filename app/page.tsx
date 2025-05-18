import { getColumns } from "./api/get-columns/get-columns";
import { BoardSection } from "./board-section";

export default async function Home() {
  const columns = await getColumns();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Petters Board</h1>
      <p>Her er arbeidsoppgavene mine.</p>
      <p>
        OBS! Ikke flytt så raskt på kortene, det kan hende at de hopper litt
        rundt da 😬
      </p>
      <BoardSection columns={columns} />
    </div>
  );
}
