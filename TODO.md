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

## 🔜 Soon

- [x] Free minutes counter in dashboard ("Free minutes remaining: X min")
- [x] Stripe integration — actual payments when trial ends
- [x] Paywall page when free minutes hit 0
- [ ] Phone number auto-provision per clinic on signup (Twilio)
- [ ] Link Twilio number to Vapi assistant automatically
- [ ] Attach Booking Details structured output to auto-provisioned assistants

## 🔐 Security

- [ ] Webhook signature verification (confirm requests are genuinely from Vapi using VAPI_SECRET)
- [ ] Rate limiting on all API routes
- [ ] Input validation on all API routes
- [ ] Review and complete all Supabase RLS policies
- [ ] Add UPDATE and DELETE policies for appointments table
- [ ] Add DELETE policy for clinics table
- [ ] Verify service role can write to appointments (for webhook)
- [ ] Verify all environment variables are correctly set in production

## 📞 Phone & Number Porting

- [ ] Number porting flow — business owners can port existing Polish number to Twilio
- [ ] Register sole proprietorship (jednoosobowa działalność gospodarcza) for legal Polish Twilio numbers
- [ ] Onboarding step for number porting ("Keep your existing number, we handle the rest")
- [ ] Twilio → Vapi integration (link Twilio number to Vapi assistant)

## ⚙️ Settings & Management

- [ ] Settings page — edit assistant name, greeting, voice
- [ ] Appointment management — cancel, reschedule, mark no-show
- [ ] Email notification to owner when appointment is booked

## 🌐 Omnichannel (n8n)

- [ ] n8n integration for WhatsApp bookings
- [ ] n8n integration for SMS bookings
- [ ] n8n integration for Telegram bookings
- [ ] Confirmation messages via WhatsApp/SMS after booking
- [ ] Reminder messages 24 hours before appointment

## 🎨 Landing Page & Marketing

- [ ] "How it works" — animated phone mockup (SMS/Telegram booking flow)
- [ ] "See how it works" links to example video
- [ ] Voice test after onboarding ("hear your AI receptionist")

## 💳 Billing

- [ ] Stripe checkout for all 3 plans
- [ ] Webhook from Stripe to activate/deactivate subscription
- [ ] Subscription status shown in dashboard
- [ ] Cancel subscription flow

## 📊 Analytics

- [ ] Calls per day chart
- [ ] Busiest hours breakdown
- [ ] Conversion rate (calls → bookings)
- [ ] Monthly booking summary

## 💡 MVP Vision (saved for reference)

- Omnichannel AI receptionist: phone (Vapi) + WhatsApp + SMS + Telegram
- All bookings in one dashboard regardless of channel
- Each business gets their own Twilio number on signup
- Number porting — businesses keep their existing number, patients never notice
- Freemium: 15 free minutes on signup, then paid plans
- Register sole proprietorship for legal Polish Twilio numbers

## 🗓️ Calendar & Booking Logic

- [ ] Calendar availability — check free slots before confirming booking
- [ ] 30-min interval slot system, multiple bookings per day
- [ ] Prevent double bookings

## 🎙️ Assistant Quality

- [ ] Full prompt overhaul — natural, warm, industry-specific tone
- [ ] Upgrade voice model if needed
- [ ] Handle edge cases: rescheduling, unclear requests, no available slots
