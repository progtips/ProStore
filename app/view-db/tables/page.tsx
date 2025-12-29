import { Suspense } from "react";
import TablesClient from "./TablesClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-8">Загрузка...</div>}>
      <TablesClient />
    </Suspense>
  );
}
