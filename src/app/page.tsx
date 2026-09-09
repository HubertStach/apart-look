import { HydrateClient, api } from "~/trpc/server";
import { ProfilePanel } from "~/app/_components/profile-panel";
import { ListingList } from "~/app/_components/listing-list";

// Aplikacja jest w pełni dynamiczna (dane z lokalnej bazy) — nie prerenderujemy
// statycznie, bo to uruchamiałoby zapytania do bazy podczas `next build`.
export const dynamic = "force-dynamic";

export default async function Home() {
  // prefetch dla szybszego pierwszego renderu
  void api.profile.get.prefetch();

  return (
    <HydrateClient>
      <div className="flex h-screen w-screen overflow-hidden">
        <ProfilePanel />
        <ListingList />
      </div>
    </HydrateClient>
  );
}
