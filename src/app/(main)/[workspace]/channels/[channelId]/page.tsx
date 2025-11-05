import MessageList from "@/components/slack/MessageList";
import Composer from "@/components/slack/Composer";

export default function ChannelPage({
  params,
}: {
  params: { workspace: string; channelId: string };
}) {
  const { workspace, channelId } = params;
  return (
    <div className="h-full grid grid-rows-[1fr_auto]">
      <MessageList scope={{ kind: "channel", workspace, id: channelId }} />
      <Composer scope={{ kind: "channel", workspace, id: channelId }} />
    </div>
  );
}
