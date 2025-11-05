"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/slack/Sidebar";
import Header from "@/components/slack/Header";
import { AuthProvider } from "@/lib/auth-client";
import RightProfile from "@/components/slack/RightProfile";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string } | Promise<{ workspace: string }>;
}) {
  const [ws, setWs] = useState<string>("");
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await params;
      setWs(p.workspace);
    })();
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js");
  }, [params]);

  if (!ws) return null;

  return (
    <AuthProvider>
      <div className="h-screen grid grid-cols-[260px_1fr]">
        <aside className="bg-[var(--panel)] border-r">
          {/* Left rail */}
          <Sidebar workspaceSlug={ws} />
        </aside>

        <div className="grid grid-rows-[56px_1fr]">
          <Header onToggleProfile={() => setShowProfile((s) => !s)} />
          <div
            className="min-h-0 grid"
            style={{ gridTemplateColumns: showProfile ? "1fr 320px" : "1fr" }}
          >
            <div className="min-h-0">{children}</div>
            {showProfile && <RightProfile />}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
