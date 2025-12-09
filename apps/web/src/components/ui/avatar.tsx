import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar"
			className={cn(
				"flex items-center justify-center rounded-full bg-primary/10 text-primary",
				className,
			)}
			{...props}
		/>
	);
}

function AvatarImage({ className, ...props }: React.ComponentProps<"img">) {
	return (
		<img
			data-slot="avatar-image"
			className={cn("rounded-full", className)}
			{...props}
		/>
	);
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="avatar-fallback"
			className={cn("flex items-center justify-center", className)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };

