import MessageList from "@/components/slack/MessageList";
import Composer from "@/components/slack/Composer";
export default function DMPage({
  params,
}: {
  params: { workspace: string; userId: string };
}) {
  const { workspace, userId } = params;
  return (
    <div className="h-full grid grid-rows-[1fr_auto]">
      <MessageList scope={{ kind: "dm", workspace, id: userId }} />
      <Composer scope={{ kind: "dm", workspace, id: userId }} />
    </div>
  );
}
