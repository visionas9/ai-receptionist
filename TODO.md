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
- [x] Pricing page (3 plans)
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
- [x] Display "Unlimited" instead of "99999 min free remaining" post-checkout
- [x] Assistant prompt overhaul — natural, warm, industry-specific tone
- [x] Voice upgraded to ElevenLabs Sarah (eleven_turbo_v2_5)
- [x] LLM upgraded to gpt-4o for better instruction following
- [x] Full i18n — Polish default, English toggle (🇵🇱/🇬🇧)
- [x] Auth pages respect language preference
- [x] Onboarding language preference step (PL/EN)
- [x] Store language preference in Supabase
- [x] Dashboard language sync + toggle fixed
- [x] Stripe checkout renders in correct language
- [x] Ghost booking prevention (silent/abandoned calls no longer saved)
- [x] Wrong year on appointments fixed (year corrected to current year)

## 🔜 Soon

- [ ] Polish translations reviewed by native speaker
- [ ] Email notification to owner when appointment is booked
- [ ] Subscription status shown in dashboard
- [ ] Cancel subscription flow
- [ ] Voice test after onboarding ("hear your AI receptionist")
- [ ] Handle edge cases: rescheduling, unclear requests, no available slots

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

## ⚙️ Settings & Management

- [ ] Settings page — edit assistant name, greeting, voice
- [ ] Appointment management — cancel, reschedule, mark no-show

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
- Freemium: 15 free minutes on signup, then paid plans
- Free tier: browser-based test call, no dedicated number
- Paid tier: dedicated Twilio number provisioned automatically
- Face-to-face demos: 1 number manually reassigned per demo (~$4/month)
- Full Polish + English i18n
- Register JDG → upgrade Twilio ISV → enable SMS → full launch
