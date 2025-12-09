import Card from "@/components/Card";

export default function InstructionsPage() {
	return (
		<Card>
			<div className="h-full p-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					Instructions
				</h1>
				<p className="text-gray-600">
					View and manage instructions for your AI assistant.
				</p>
			</div>
		</Card>
	);
}

