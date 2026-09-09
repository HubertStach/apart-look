import { HydrateClient, api } from "~/trpc/server";
import { WorkspaceShell } from "~/app/_components/workspace-shell";

// Aplikacja jest w pełni dynamiczna (dane z lokalnej bazy) — nie prerenderujemy
// statycznie, bo to uruchamiałoby zapytania do bazy podczas `next build`.
export const dynamic = "force-dynamic";

export default async function Home() {
  // prefetch dla szybszego pierwszego renderu
  void api.profile.get.prefetch();

  return (
    <HydrateClient>
      <WorkspaceShell />
    </HydrateClient>
  );
}
