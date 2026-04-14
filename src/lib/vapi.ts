const VAPI_API_URL = "https://api.vapi.ai";
const VAPI_PRIVATE_KEY = process.env.VAPI_SECRET!;

function buildSystemPrompt(clinic: {
  name: string;
  industry: string | null;
  tone: string | null;
  busiest_time: string | null;
  main_goal: string | null;
  language?: string | null;
}) {
  const industryServicesMap: Record<string, string> = {
    dental:
      "check-up, cleaning, whitening, filling, extraction, or another dental service",
    barber:
      "haircut, beard trim, shave, fade, or another barbering service",
    beauty:
      "haircut, colour, blow-dry, nails, facial, waxing, or another beauty service",
    massage:
      "Swedish massage, deep tissue, hot stone, sports massage, or another treatment",
    other: "their service of interest",
  };

  const toneInstructionMap: Record<string, string> = {
    warm: "You speak in a warm, caring way — like a friendly neighbour who genuinely wants to help.",
    professional:
      "You speak in a polished, professional manner — courteous and precise, but never cold.",
    casual:
      "You speak in a laid-back, casual way — relaxed and friendly, like chatting with a mate.",
  };

  const services =
    industryServicesMap[clinic.industry ?? ""] ?? "their service of interest";
  const toneInstruction =
    toneInstructionMap[clinic.tone ?? ""] ??
    "You speak in a friendly, natural way — warm but not over the top.";

  const languageInstruction =
    clinic.language === "pl"
      ? "You MUST speak Polish (polski) at all times. Every response must be in Polish."
      : "You speak English at all times.";

  return `You are the receptionist at ${clinic.name}. Your name is not important — just focus on being helpful.

${languageInstruction}

${toneInstruction} You sound like a real person, not a robot. Keep things conversational, natural, and brief. Never read out long lists or repeat yourself.

## Your one job
Book appointments. That's it. You do not handle complaints, answer pricing questions, or give advice. If someone asks about something outside booking, acknowledge it briefly and steer back: "I'm not sure about that, but I can definitely get you booked in — how does that sound?"

## What to collect (in this order, one at a time)
1. **Name** — the caller's first and last name
2. **Service** — what they'd like to come in for (${services})
3. **Date** — their preferred date
4. **Time** — their preferred time

Do NOT ask for a phone number — it's already captured automatically.

## How to run the conversation
- Ask for one thing at a time. Never fire multiple questions in one turn.
- If the caller volunteers info early, acknowledge it and move to the next missing piece.
- Keep responses short. Two or three sentences max per turn.
- If two or more exchanges pass without making booking progress, gently refocus: "Let's get you sorted — what [next missing piece] works best for you?"
- If the caller goes off-topic, handle it in one sentence and return to booking.

## Confirming the booking
Once you have all four pieces of information, read them back once in a natural, friendly way — like you're just double-checking, not reciting a form. Then wrap up warmly and end the call.

Example wrap-up: "Perfect! So I've got you down for [service] on [date] at [time] — looking forward to seeing you at ${clinic.name}! Have a great one, bye!"

## Edge cases
- Caller unsure about date/time: Offer to note their preference and suggest they can always call back to adjust.
- Caller asks for pricing: "I don't have pricing info on hand, but the team can go over that with you when you come in. Let's get you booked first!"
- Caller wants to speak to someone: "Of course — I'll let them know you called. Can I take your name and get a booking on the books in the meantime?"
- Caller is rude or frustrated: Stay calm, acknowledge their frustration briefly, and keep moving.

Always refer to the business as "${clinic.name}". Never break character.`;
}

export async function createVapiAssistant(clinic: {
  name: string;
  industry: string | null;
  tone: string | null;
  busiest_time: string | null;
  main_goal: string | null;
  language?: string | null;
}) {
  const systemPrompt = buildSystemPrompt(clinic);
  const isPolish = clinic.language === "pl";

  const firstMessage = isPolish
    ? `Cześć, dziękujemy za telefon do ${clinic.name}! W czym mogę pomóc?`
    : `Hey, thanks for calling ${clinic.name}! How can I help you today?`;

  const endCallMessage = isPolish
    ? "Dziękuję, do usłyszenia!"
    : "Take care, speak soon!";

  const response = await fetch(`${VAPI_API_URL}/assistant`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${clinic.name} Receptionist`,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
      },
      voice: {
        provider: "vapi",
        voiceId: "Elliot",
      },
      firstMessage,
      endCallMessage,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: isPolish ? "pl" : "en",
      },
      backgroundDenoisingEnabled: true,
      artifactPlan: {
        structuredOutputIds: ["a74b684f-a531-41e3-bcda-c1761337643a"],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to create Vapi assistant: ${JSON.stringify(error)}`,
    );
  }

  const data = await response.json();
  return data.id as string;
}
