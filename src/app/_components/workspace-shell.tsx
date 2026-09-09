"use client";

import { useState } from "react";
import { ProfilePanel } from "./profile-panel";
import { ListingList } from "./listing-list";

export function WorkspaceShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {collapsed ? (
        // Zwinięty pasek — cienka kolumna z przyciskiem rozwijania
        <div className="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-linen bg-panel py-4">
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Pokaż panel profilu"
            title="Pokaż panel profilu"
            className="rounded-md p-2 text-cocoa transition-colors hover:bg-ecru"
          >
            <span className="text-lg">☰</span>
          </button>
          <span
            className="text-xs font-semibold tracking-wide text-mocha"
            style={{ writingMode: "vertical-rl" }}
          >
            🏠 apart-look
          </span>
        </div>
      ) : (
        <ProfilePanel onCollapse={() => setCollapsed(true)} />
      )}
      <ListingList />
    </div>
  );
}
