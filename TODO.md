# Receply Build Tracker

## ✅ Done

- [x] Auth (login/signup)
- [x] Dashboard with stats + appointments table
- [x] Webhook + real-time updates
- [x] Vapi assistant + structured outputs
- [x] Deployed to Vercel
- [x] Logo links back to landing page
- [x] Loading state on signup button
- [x] Better hero appointment table on landing page
- [x] Onboarding flow (5 questions, 1 at a time)
- [x] Save onboarding answers to Supabase
- [x] Animated loading screen after onboarding
- [x] Pricing page — single plan (799 PLN/month, 1500 min)
- [x] Broaden landing page messaging (not just clinics)
- [x] Update landing page copy for broader audience
- [x] Mobile-responsive appointments table (card layout)
- [x] UI polish across all pages (warm cream theme)
- [x] Auto-provision Vapi assistant per clinic on signup
- [x] Webhook routes to correct clinic by assistant ID
- [x] Customize AI prompt based on onboarding answers (industry, tone, business name)
- [x] Remove duplicate clinic name from signup
- [x] Free minutes counter in dashboard
- [x] Stripe integration — actual payments when trial ends
- [x] Paywall page when free minutes hit 0
- [x] Pricing CTA buttons redirect to Stripe checkout (not dashboard)
- [x] Single Stripe product at 799 PLN/month
- [x] Paid tier minutes set to 1500 (not 99999)
- [x] Minutes deduct correctly after each call
- [x] Assistant prompt overhaul — natural, warm, industry-specific tone
- [x] Voice upgraded to ElevenLabs Sarah (eleven_turbo_v2_5)
- [x] LLM upgraded to gpt-4o-mini for cost efficiency
- [x] Full i18n — Polish default, English toggle (🇵🇱/🇬🇧)
- [x] Auth pages respect language preference
- [x] Onboarding language preference step (PL/EN)
- [x] Store language preference in Supabase
- [x] Dashboard language sync + toggle fixed
- [x] Stripe checkout renders in correct language
- [x] Ghost booking prevention (silent/abandoned calls no longer saved)
- [x] Wrong year on appointments fixed (year corrected to current year)
- [x] Email notification to owner when appointment is booked (Resend)
- [x] Correct user session after Stripe redirect
- [x] Welcome to Pro banner on dashboard after payment
- [x] Cursor pointer on all interactive buttons
- [x] End to end test passed — call → booking → email ✅

## 🧪 Live Test Prep (Remaining)

- [ ] Polish translations reviewed by native speaker
- [ ] Subscription status shown in dashboard
- [ ] Language toggle regression — stays switched after reload
- [ ] Test Stripe payment → correct dashboard redirect on production
- [ ] 1-week self-test with real calls

## 🔜 Soon (Post Live Test)

- [ ] Cancel subscription flow
- [ ] Voice test after onboarding ("hear your AI receptionist")
- [ ] Handle edge cases: rescheduling, unclear requests, no available slots
- [ ] Appointment management — cancel, reschedule, mark no-show
- [ ] Settings page — edit assistant name, greeting, voice
- [ ] Email reminder 24h before appointment

## 🔐 Security (Pre-launch)

- [ ] Webhook signature verification (Vapi secret)
- [ ] Rate limiting on all API routes
- [ ] Input validation on all API routes
- [ ] Review and complete all Supabase RLS policies
- [ ] Add UPDATE and DELETE policies for appointments table
- [ ] Add DELETE policy for clinics table
- [ ] Verify service role can write to appointments (for webhook)
- [ ] Verify all environment variables are correctly set in production

## 📞 Phone & Number Porting (Post-JDG)

- [ ] Register sole proprietorship (JDG) — prerequisite for everything below
- [ ] Upgrade Twilio to paid/ISV account after JDG
- [ ] Auto-provision Twilio number per clinic on signup
- [ ] Link Twilio number to Vapi assistant automatically
- [ ] Attach structured output to auto-provisioned assistants
- [ ] Number pool for free trials (7-day trial, recycled numbers)
- [ ] Number porting flow — businesses keep existing number
- [ ] Onboarding step for number porting
- [ ] Auto-detach number when 1500 min cap hit → manual mode fallback

## ⚙️ Settings & Management

- [ ] Settings page — edit assistant name, greeting, voice

## 🌐 Omnichannel (Post-JDG, n8n)

- [ ] n8n integration for WhatsApp bookings
- [ ] n8n integration for SMS bookings
- [ ] n8n integration for Telegram bookings
- [ ] Confirmation messages via WhatsApp/SMS after booking
- [ ] Reminder messages 24 hours before appointment

## 🎨 Landing Page & Marketing

- [ ] "How it works" — animated phone mockup
- [ ] "See how it works" links to example video

## 📊 Analytics

- [ ] Calls per day chart
- [ ] Busiest hours breakdown
- [ ] Conversion rate (calls → bookings)
- [ ] Monthly booking summary

## 🗓️ Calendar & Booking Logic

- [ ] Calendar availability — check free slots before confirming booking
- [ ] 30-min interval slot system, multiple bookings per day
- [ ] Prevent double bookings

## 💡 MVP Vision (saved for reference)

- Omnichannel AI receptionist: phone (Vapi) + WhatsApp + SMS + Telegram
- All bookings in one dashboard regardless of channel
- Each business gets their own Twilio number on signup (post-JDG)
- Number porting — businesses keep their existing number
- Single plan: 799 PLN/month, 1500 minutes included
- When 1500 min hit → number detaches → manual mode until reset
- Free tier: 15 free minutes, browser-based test call only
- Face-to-face demos: 1 number manually reassigned per demo (~$4/month)
- Full Polish + English i18n
- Register JDG → upgrade Twilio ISV → enable SMS → full launch