const VAPI_API_URL = "https://api.vapi.ai";
const VAPI_PRIVATE_KEY = process.env.VAPI_SECRET!;

function buildSystemPrompt(clinic: {
  name: string;
  industry: string | null;
  tone: string | null;
  busiest_time: string | null;
  main_goal: string | null;
}) {
  const toneMap: Record<string, string> = {
    warm: "warm, friendly, and welcoming",
    professional: "professional and formal",
    casual: "casual and relaxed",
  };

  const industryMap: Record<string, string> = {
    dental: "dental clinic",
    barber: "barber shop",
    beauty: "beauty salon",
    massage: "massage salon",
    other: "service business",
  };

  const tone = toneMap[clinic.tone ?? ""] ?? "friendly and professional";
  const industry = industryMap[clinic.industry ?? ""] ?? "service business";

  return `You are a ${tone} AI receptionist for ${clinic.name}, a ${industry}.

Your job is to book appointments for customers who call in.

Ask the caller for:
1. Their full name
2. Their preferred date and time
3. The reason for their visit
4. Their phone number

Once you have all the information, confirm the booking back to them and say goodbye politely.

Keep the conversation natural and ${tone}. Do not ask for all information at once. Always refer to the business as "${clinic.name}".`;
}

export async function createVapiAssistant(clinic: {
  name: string;
  industry: string | null;
  tone: string | null;
  busiest_time: string | null;
  main_goal: string | null;
}) {
  const systemPrompt = buildSystemPrompt(clinic);

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
      firstMessage: `Hello, thank you for calling ${clinic.name}. How can I help you today?`,
      endCallMessage: "Goodbye, have a wonderful day!",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
      },
      backgroundDenoisingEnabled: true,
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
