import Card from "@/components/Card";
import ConversationsClient from "./ConversationsClient";
import { getAllConversations } from "@/lib/conversation";

export default async function ConversationsPage() {
  const conversations = await getAllConversations();
  return (
    <Card>
      <div className="h-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Conversations</h1>
        <p className="text-gray-600 mb-8">
          View and manage all your conversations.
        </p>
        <ConversationsClient initialConversations={conversations} />
      </div>
    </Card>
  );
}
