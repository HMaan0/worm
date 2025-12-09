import Card from "@/components/Card";

export default function Home() {
  return (
    <Card>
      <div className="h-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Home</h1>
        <p className="text-gray-600 mb-6">
          These are the latest conversations that your Robin has flagged as
          needing your attention.
        </p>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500">
            When a conversation needs your attention, it will appear here. For
            now, you're all good!
          </p>
        </div>
      </div>
    </Card>
  );
}
