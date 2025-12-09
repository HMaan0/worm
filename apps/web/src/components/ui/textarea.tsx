import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleResize = (target: HTMLTextAreaElement) => {
    target.style.height = "auto";

    const computed = window.getComputedStyle(target);
    const lineHeight = parseFloat(computed.lineHeight || "20");
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;

    if (target.scrollHeight > maxHeight) {
      target.style.height = `${maxHeight}px`;
      target.style.overflowY = "auto";
    } else {
      target.style.height = `${target.scrollHeight}px`;
      target.style.overflowY = "hidden";
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    handleResize(target);

    if (props.onInput) props.onInput(e);
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      handleResize(textareaRef.current);
    }
  }, [props.value, props.defaultValue]);

  return (
    <textarea
      ref={textareaRef}
      data-slot="textarea"
      rows={1}
      onInput={handleInput}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 lg:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "resize-none overflow-hidden min-h-[38px]",
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:border-2",
        "[&::-webkit-scrollbar-thumb]:border-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-clip-content",
        "[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/40",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
