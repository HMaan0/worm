import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol
        className="list-decimal list-outside ml-4  marker:text-[#5c5c5c]"
        {...props}
      >
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1 marker:text-[#5c5c5c]" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul
        className="list-disc list-outside ml-5  marker:text-[#5c5c5c]"
        {...props}
      >
        {children}
      </ul>
    );
  },
  p: ({ node, children, ...props }) => {
    return (
      <p className="my-0.5 leading-relaxed" {...props}>
        {children}
      </p>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-[#5c5c5c] hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <>
        <div className="mt-0 mb-2  first:block hidden ">
          <h1 className="text-[14px] font-semibold" {...props}>
            {children}
          </h1>
        </div>
        <div className="mt-10 mb-2  nth-2:hidden">
          <div className="border-b border-[#5c5c5c] my-3 "></div>
          <h1 className="text-[14px] font-semibold" {...props}>
            {children}
          </h1>
        </div>
      </>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <div className="mt-2 mb-2">
        <div className="border-b border-[#5c5c5c] my-3 "></div>
        <h2 className="text-xl font-semibold" {...props}>
          {children}
        </h2>
      </div>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <div className="mt-2 mb-2">
        <div className="border-b border-[#5c5c5c] my-3 "></div>
        <h3 className="text-lg font-semibold" {...props}>
          {children}
        </h3>
      </div>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <div className="mt-2 mb-2">
        <div className="border-b border-[#5c5c5c] my-3 "></div>
        <h4 className="text-lg font-semibold" {...props}>
          {children}
        </h4>
      </div>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <div className="mt-2 mb-2">
        <div className="border-b border-[#5c5c5c] my-3 "></div>
        <h5 className="text-base font-semibold" {...props}>
          {children}
        </h5>
      </div>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <div className="mt-2 mb-1">
        <div className="border-b border-[#5c5c5c] my-3 "></div>
        <h6 className="text-sm font-semibold" {...props}>
          {children}
        </h6>
      </div>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const escapedChildren = children.replace(/^---$/gm, "");
  return (
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {escapedChildren}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
