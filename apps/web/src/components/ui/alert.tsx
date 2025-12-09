import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.ComponentProps<"div"> {
	variant?: "default" | "warning" | "info" | "success" | "error";
}

function Alert({ className, variant = "default", ...props }: AlertProps) {
	const variants = {
		default: "bg-gray-50 border-gray-200",
		warning: "bg-amber-50 border-amber-200",
		info: "bg-blue-50 border-blue-200",
		success: "bg-green-50 border-green-200",
		error: "bg-red-50 border-red-200",
	};

	return (
		<div
			data-slot="alert"
			className={cn(
				"rounded-lg border p-4",
				variants[variant],
				className,
			)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="alert-title"
			className={cn("font-semibold mb-2", className)}
			{...props}
		/>
	);
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="alert-description"
			className={cn("text-sm", className)}
			{...props}
		/>
	);
}

export { Alert, AlertTitle, AlertDescription };

