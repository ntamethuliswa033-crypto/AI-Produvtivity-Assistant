import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string().max(200).optional().default(""),
  purpose: z.string().min(1).max(2000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  keyPoints: z.string().max(4000).optional().default(""),
  length: z.enum(["Short", "Medium", "Long"]),
});

const SummaryInput = z.object({
  title: z.string().max(200).optional().default(""),
  notes: z.string().min(1).max(20000),
});

const PlannerInput = z.object({
  tasks: z.string().min(1).max(10000),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  dueDates: z.string().max(2000).optional().default(""),
  hours: z.string().max(50).optional().default(""),
  mode: z.enum(["Daily", "Weekly"]),
});

const ResearchInput = z.object({
  topic: z.string().min(1).max(500),
  notes: z.string().max(20000).optional().default(""),
  depth: z.enum(["Short", "Medium", "Detailed"]),
});

const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().min(1).max(8000) }))
    .min(1)
    .max(40),
});

async function run(system: string, prompt: string) {
  const { generateText, AiError } = await import("./ai.server");
  try {
    return { text: await generateText({ system, messages: [{ role: "user", text: prompt }] }) };
  } catch (error) {
    if (error instanceof AiError) throw new Error(error.message);
    throw error;
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { emailSystemPrompt } = await import("./prompts");
    const prompt = [
      `Recipient: ${data.recipient || "Not specified"}`,
      `Purpose: ${data.purpose}`,
      `Tone: ${data.tone}`,
      `Desired length: ${data.length}`,
      `Key points:\n${data.keyPoints || "Not specified"}`,
    ].join("\n");
    return run(emailSystemPrompt, prompt);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const { summarySystemPrompt } = await import("./prompts");
    const prompt = `Meeting title: ${data.title || "Not specified"}\n\nRaw notes:\n${data.notes}`;
    return run(summarySystemPrompt, prompt);
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { plannerSystemPrompt } = await import("./prompts");
    const prompt = [
      `Planning mode: ${data.mode}`,
      `Overall priority level: ${data.priority}`,
      `Available work hours: ${data.hours || "Not specified"}`,
      `Due dates: ${data.dueDates || "Not specified"}`,
      `Tasks:\n${data.tasks}`,
    ].join("\n");
    return run(plannerSystemPrompt, prompt);
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const { researchSystemPrompt } = await import("./prompts");
    const prompt = [
      `Research topic: ${data.topic}`,
      `Requested depth: ${data.depth}`,
      `Supplied notes or article text:\n${data.notes || "None"}`,
    ].join("\n");
    return run(researchSystemPrompt, prompt);
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { generateText, AiError } = await import("./ai.server");
    const { chatSystemPrompt } = await import("./prompts");
    try {
      return {
        text: await generateText({ system: chatSystemPrompt, messages: data.messages }),
      };
    } catch (error) {
      if (error instanceof AiError) throw new Error(error.message);
      throw error;
    }
  });
