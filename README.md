<div align="center">

<br/>

```
██████╗ ███████╗ ██████╗███████╗██████╗ ██╗  ██╗   ██╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗██║  ╚██╗ ██╔╝
██████╔╝█████╗  ██║     █████╗  ██████╔╝██║   ╚████╔╝
██╔══██╗██╔══╝  ██║     ██╔══╝  ██╔═══╝ ██║    ╚██╔╝
██║  ██║███████╗╚██████╗███████╗██║     ███████╗██║
╚═╝  ╚═╝╚══════╝ ╚═════╝╚══════╝╚═╝     ╚══════╝╚═╝
```

**AI-powered phone receptionist for small businesses. Built by a solo founder, in production.**

[![Live Demo](https://img.shields.io/badge/🔴_LIVE-ai--receptionist--flame.vercel.app-E65100?style=for-the-badge)](https://ai-receptionist-flame.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## What is Receply?

Receply is a **multi-tenant SaaS platform** that gives small service businesses — barber shops, beauty salons, medical clinics — a fully autonomous AI receptionist accessible by phone, 24/7.

A customer calls a local barber shop. Instead of a voicemail or a busy signal, they're greeted by a natural, conversational AI voice. It takes their name, asks which service they want, confirms a date and time, and books the appointment — no human involved, no app to download.

The business owner logs into a real-time dashboard and sees the booking appear live.

**This is fully working in production today.**

---

## Why it exists

Most small service businesses in Poland — and across Europe — have zero digital booking infrastructure. They rely on phone calls, WhatsApp messages, and handwritten notebooks. When nobody picks up, the customer goes elsewhere.

Receply installs in minutes and turns every missed call into a confirmed appointment.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CUSTOMER                                 │
│                    calls a business number                       │
└────────────────────────────┬────────────────────────────────────┘
                             │ PSTN call
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         TWILIO                                   │
│         Polish mobile number (+48) — routes call to Vapi        │
└────────────────────────────┬────────────────────────────────────┘
                             │ SIP / WebRTC
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          VAPI.AI                                 │
│   AI voice orchestration layer                                   │
│   • GPT-4o for language understanding                           │
│   • ElevenLabs (Sarah voice) for speech synthesis               │
│   • Structured output schema — extracts: name, service,         │
│     date, time from natural conversation                         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS webhook (end-of-call report)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS API ROUTE                           │
│   /api/vapi-webhook                                              │
│   • Validates incoming payload                                   │
│   • Extracts structured booking data                             │
│   • Writes appointment record to Supabase                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ Supabase Realtime
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BUSINESS OWNER DASHBOARD                        │
│   Appointment appears instantly — no refresh needed              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 🤖 Auto-provisioned AI Assistant per Business

When a business completes onboarding, the platform automatically creates a Vapi AI assistant scoped to that account — with the business name, services offered, and operating hours baked into the system prompt. No manual setup required.

### 📞 Real Phone Number in Production

A real Polish mobile number (+48) purchased through Twilio is linked to the Vapi assistant. Calls have been tested successfully end-to-end. The platform is designed around an **ISV model** — Receply owns all provisioned numbers; individual businesses never touch Twilio.

### 🎙️ Natural Conversation Design

The AI doesn't sound like a bot. The conversation is engineered to feel like talking to a calm, professional receptionist. It collects exactly what's needed — name, service, date, time — and nothing more. Designed in Polish by default.

### ⚡ Real-time Dashboard

Built with **Supabase Realtime**. When a call ends and a booking is saved, it appears in the business owner's dashboard instantly via WebSocket subscription — no polling, no refresh.

### 💳 Stripe-gated Free Trial

New accounts get a free trial with a capped number of AI minutes. When the limit is hit, the dashboard surfaces a Stripe checkout flow. Webhook-based subscription state management keeps everything in sync.

### 🌍 Full Internationalization

Polish and English, fully implemented across every surface — auth flows, onboarding, dashboard, checkout — using `next-intl`. Language toggling works in production.

---

## Tech Stack

| Layer               | Technology                                                      |
| ------------------- | --------------------------------------------------------------- |
| **Frontend**        | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| **Auth & Database** | Supabase (Auth, PostgreSQL, Row-Level Security, Realtime)       |
| **AI Voice**        | Vapi.ai — orchestrates GPT-4o + ElevenLabs                      |
| **Telephony**       | Twilio (Polish PSTN number, ISV bundle model)                   |
| **Payments**        | Stripe (Checkout, Webhooks, subscription lifecycle)             |
| **Deployment**      | Vercel (preview + production environments)                      |
| **i18n**            | next-intl                                                       |

---

## How the Webhook Works

> _This is where the magic connects — worth explaining clearly._

When a call ends, Vapi sends a POST request to `/api/vapi-webhook` with a full call report. The payload includes a `message.artifact.structuredOutputs` field — a JSON object keyed by the structured output schema ID defined at assistant creation. This contains the data the AI extracted during the call: customer name, requested service, preferred date and time.

The API route parses this payload, maps it to the `appointments` table schema, and inserts a record into Supabase. Supabase Realtime then broadcasts the change to any subscribed dashboard client.

Stripe webhooks follow the same pattern: `checkout.session.completed` and `customer.subscription.updated` events update the account's subscription status in real time.

---

## Project Structure

```
ai-receptionist/
├── app/
│   ├── [locale]/              # i18n routing via next-intl
│   │   ├── dashboard/         # Main business owner view
│   │   ├── onboarding/        # New account setup flow
│   │   └── auth/              # Login / signup
│   └── api/
│       ├── vapi-webhook/      # Receives call reports from Vapi
│       ├── stripe-webhook/    # Handles subscription events
│       └── create-assistant/  # Provisions Vapi assistant on signup
├── components/                # shadcn/ui + custom components
├── lib/                       # Supabase client, Stripe, Vapi SDK wrappers
├── messages/                  # en.json, pl.json — translation strings
└── middleware.ts              # next-intl locale detection + routing
```

---

## Trying the Live Demo

> **Note for recruiters & testers:** The live deployment is fully functional, but phone number provisioning per account is not yet automated — I'm currently operating with a single real Polish number used for validation demos. If you'd like to test an actual phone call end-to-end, reach out and I'll set it up for you personally.
>
> 📬 **sirlialperenn@gmail.com**

---

## Running Locally

```bash
git clone https://github.com/yourusername/ai-receptionist
cd ai-receptionist
npm install
```

Create a `.env.local` with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

```bash
npm run dev
```

For webhook testing locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli) and [ngrok](https://ngrok.com/) to tunnel Vapi webhook events.

---

## Status

| Feature                               | Status                                                        |
| ------------------------------------- | ------------------------------------------------------------- |
| End-to-end call → booking flow        | ✅ Live                                                       |
| Real Polish phone number              | ✅ Live                                                       |
| Real-time dashboard                   | ✅ Live                                                       |
| Stripe paywall + trial tracking       | ✅ Live                                                       |
| Polish / English i18n                 | ✅ Live                                                       |
| Auto-provisioned assistant per signup | ✅ Live                                                       |
| SMS confirmation on booking           | 🔜 Pending legal entity registration (Twilio ISV requirement) |
| Calendar availability checking        | 🔜 In progress                                                |
| n8n omnichannel (WhatsApp, Telegram)  | 🔜 Planned                                                    |

---

## About

Built as a university project turned real product by a **solo founder and developer** based in Warsaw. The goal: validate that small Polish service businesses will pay for an AI receptionist, ship something real enough to show investors, and learn by building.

The project has attracted early investor interest from a university lecturer with a VC network.

---

<div align="center">

_Made in Warsaw &nbsp;·&nbsp; Solo built &nbsp;·&nbsp; Actually in production_

</div>
