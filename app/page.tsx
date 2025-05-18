import { getColumns } from "./api/get-columns/get-columns";
import { BoardSection } from "./board-section";

export default async function Home() {
  const columns = await getColumns();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Petter&apos;s Board</h1>
      <p>My tasks</p>
      <p>
        Warning! Don&apos;t move the cards too fast. They might reshuffle 😬
      </p>
      <BoardSection columns={columns} />
    </div>
  );
}
