import Card from "./Card";

export const History = () => {
  return (
    <Card>
      <div className="p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
        <p className="text-gray-600 mb-8">View past interactions with Robin.</p>
        <p className="text-gray-500">
          (This section can later list previous chats or logs.)
        </p>
      </div>
    </Card>
  );
};
