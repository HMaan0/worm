import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import Firecrawl from "@mendable/firecrawl-js";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 1. Fetch Personality Settings
  const personality = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/personality`
  ).then((res) => res.json().catch(() => ({ casualness: 10, verbosity: 10 })));

  // 2. Fetch Knowledge Base Settings
  const knowledge = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/knowledge`
  ).then((res) =>
    res.json().catch(() => ({
      customBaseOn: false,
      websitesOn: false,
      customContext: "",
      websiteLink: "",
    }))
  );

  // 3. Build the System Prompt
  let sysPrompt = `
You are Robin (Featherworth).
Your tone and verbosity depend on these parameters:
  - Casualness: ${personality.casualness}/100
  - Verbosity: ${personality.verbosity}/100
DO's
  -Give the full response in valid GitHub-flavored Markdown with:
  - Proper blank lines between paragraphs and lists
  - Correct list syntax
  - Use headings

DON'Ts
  - Do not use --- for your response
Adjust how relaxed or formal and how detailed or brief you are based on these numbers.
`;

  if (knowledge.customBaseOn && knowledge.customContext?.trim()) {
    sysPrompt += `\n\n### IMPORTANT CONTEXT:\nUse the following information to answer user questions:\n"${knowledge.customContext}"\n`;
  }

  if (knowledge.websitesOn && knowledge.websiteLink?.trim()) {
    sysPrompt += `\n\n### REFERENCE WEBSITE:\nThe user has provided this website for reference: ${knowledge.websiteLink}.\n
    If the user asks questions that require specific content from this URL, USE the 'getWebsiteContent' tool to read it. 
    Do not guess the content. Only call the tool if you need the content to answer the question.`;
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: sysPrompt },
      ...convertToModelMessages(messages),
    ],
    tools: {
      getWebsiteContent: tool({
        description: `Scrapes the content of the reference website (${knowledge.websiteLink}) to get information.`,
        inputSchema: z.object({
          url: z
            .string()
            .describe(
              "The URL to scrape. Defaults to the reference website provided in context."
            ),
        }),
        execute: async ({ url }: { url: string }) => {
          try {
            const targetUrl = url || knowledge.websiteLink;
            const app = new Firecrawl({
              apiKey: process.env.FIRECRAWL_API_KEY,
            });
            const scrapeResponse = await app.scrape(targetUrl, {
              formats: ["markdown"],
            });
            if (!scrapeResponse) {
              return `ERROR: Failed to scrape the website at ${targetUrl}`;
            }
            return `### WEBSITE CONTENT FOR ${targetUrl}:\n\n${scrapeResponse.markdown?.substring(
              0,
              1000
            )}`;
          } catch (error) {
            console.error("Error while tool calling:", error);
            return "ERROR: Unable to read website content.";
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });
  return result.toUIMessageStreamResponse();
}
