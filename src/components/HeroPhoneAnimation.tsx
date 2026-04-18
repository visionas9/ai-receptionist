"use client";

import styles from "./HeroPhoneAnimation.module.css";

type Screen = "incoming" | "in-call" | "confirmed";

type Bubble = {
  id: number;
  who: "ai" | "caller";
  text: string;
  state: "visible" | "faded";
};

const STATIC_TRANSCRIPT: Bubble[] = [];
const STATIC_SCREEN: Screen = "incoming";
const STATIC_SHOW_DASHBOARD = false;

export default function HeroPhoneAnimation() {
  const screen = STATIC_SCREEN;
  const transcript = STATIC_TRANSCRIPT;
  const showDashboard = STATIC_SHOW_DASHBOARD;
  const aiStatus = "Listening…";
  const timer = "00:00";

  return (
    <div
      className={`${styles.root} flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-12`}
      aria-label="Demo of Receply handling an incoming call"
    >
      {/* PHONE */}
      <div className="relative scale-90 md:scale-100">
        <div className={styles.phone}>
          <div className={styles.screen}>
            <div className="z-[5] flex items-center justify-between px-[30px] pt-[18px] text-sm font-semibold text-ink">
              <span>9:41</span>
              <div className="flex items-center gap-[5px]">
                <svg viewBox="0 0 16 11" fill="currentColor" className="h-[11px] w-4">
                  <rect x="0" y="7" width="3" height="4" rx="1" />
                  <rect x="4" y="5" width="3" height="6" rx="1" />
                  <rect x="8" y="3" width="3" height="8" rx="1" />
                  <rect x="12" y="0" width="3" height="11" rx="1" />
                </svg>
                <span className="text-[11px]">100%</span>
              </div>
            </div>

            {/* Screen 1 — incoming call */}
            <div
              className={`${styles.callScreen} ${styles.incoming}`}
              data-active={screen === "incoming"}
            >
              <div className="mt-5 flex flex-col items-center">
                <div className="mb-[30px] text-[13px] uppercase tracking-[0.1em] text-ink-soft">
                  Incoming call · Receply
                </div>
                <div className={`${styles.avatar} mb-6`}>A</div>
                <div className="mb-1.5 font-[var(--font-fraunces)] text-[26px] font-medium text-ink">
                  Anna Kowalski
                </div>
                <div className="text-[15px] text-ink-soft">+48 501 234 567</div>
              </div>
              <div className="flex gap-[70px]">
                <div className={`${styles.callBtn} ${styles.callBtnDecline}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="none"
                    className="h-7 w-7"
                    style={{ transform: "rotate(135deg)" }}
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </div>
                <div className={`${styles.callBtn} ${styles.callBtnAccept}`}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2}
                    className="h-7 w-7"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Screen 2 — in call with AI */}
            <div
              className={`${styles.callScreen} ${styles.inCall}`}
              data-active={screen === "in-call"}
            >
              <div className="mb-2.5 text-xs uppercase tracking-[0.15em] text-cream/60">
                AI Receptionist
              </div>
              <div className="mb-1.5 text-[22px] font-medium" style={{ fontFamily: "var(--font-fraunces), serif" }}>
                Bright Smile Dental
              </div>
              <div className="mb-[30px] text-sm tabular-nums text-cream/70">
                {timer}
              </div>
              <div className={`${styles.aiOrb} mb-[30px]`} />
              <div className="mb-4 text-[13px] uppercase tracking-[0.1em] text-cream/50">
                {aiStatus}
              </div>
              <div className="flex w-full flex-col gap-2.5 px-1">
                {transcript.map((b) => (
                  <div
                    key={b.id}
                    data-state={b.state}
                    className={`${styles.bubble} ${b.who === "ai" ? styles.bubbleAi : styles.bubbleCustomer}`}
                  >
                    <div className="mb-[3px] text-[10px] font-medium uppercase tracking-[0.1em] opacity-55">
                      {b.who === "ai" ? "AI" : "Caller"}
                    </div>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Screen 3 — booked */}
            <div
              className={`${styles.callScreen} ${styles.confirmed}`}
              data-active={screen === "confirmed"}
            >
              <div className={`${styles.checkCircle} mb-6`}>
                <svg viewBox="0 0 24 24" className="h-11 w-11">
                  <path d="M5 13l4 4L19 7" className={styles.checkPath} />
                </svg>
              </div>
              <div
                className="mb-2 text-[28px] font-medium text-ink"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                Booked
              </div>
              <div className="max-w-[220px] text-[15px] leading-[1.5] text-ink-soft">
                Anna&apos;s appointment has been added to your dashboard.
              </div>
              <div className="mt-[30px] w-full rounded-[18px] border border-sage/10 bg-white p-4 px-[18px] text-left shadow-[0_10px_30px_-10px_rgba(42,38,35,0.12)]">
                <div className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-sage">
                  New booking
                </div>
                <div
                  className="mb-1 text-[18px] font-medium"
                  style={{ fontFamily: "var(--font-fraunces), serif" }}
                >
                  Anna Kowalski
                </div>
                <div className="text-[13px] text-ink-soft">
                  Friday, Mar 14 · 15:00 · Checkup
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARD */}
      <div className="w-full max-w-sm md:w-[380px]">
        <div className={styles.dashboardCard} data-show={showDashboard}>
          <div className="mb-5 flex items-center justify-between border-b border-mist pb-4">
            <div
              className="text-[17px] font-medium"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Bright Smile Dental
            </div>
            <div className={`${styles.liveDot} flex items-center text-[11px] font-medium uppercase tracking-[0.1em] text-sage`}>
              Live
            </div>
          </div>
          <div className="mb-2.5 inline-block rounded bg-sage px-2 py-[3px] text-[10px] font-medium uppercase tracking-[0.1em] text-cream">
            Just now
          </div>
          <div className={`${styles.bookingRow} ${styles.bookingRowHighlighted}`}>
            <div>
              <div className="mb-0.5 text-[15px] font-medium">Anna Kowalski</div>
              <div className="text-xs text-ink-soft">Fri · Mar 14 · 15:00 · Checkup</div>
            </div>
            <div className="rounded-full bg-success-sage/10 px-2.5 py-1 text-[11px] font-medium tracking-wider text-success-sage">
              Confirmed
            </div>
          </div>
          <div className={styles.bookingRow}>
            <div>
              <div className="mb-0.5 text-[15px] font-medium">John Smith</div>
              <div className="text-xs text-ink-soft">Fri · Mar 14 · 11:30 · Cleaning</div>
            </div>
            <div className="rounded-full bg-success-sage/10 px-2.5 py-1 text-[11px] font-medium tracking-wider text-success-sage">
              Confirmed
            </div>
          </div>
          <div className={styles.bookingRow}>
            <div>
              <div className="mb-0.5 text-[15px] font-medium">Maria Nowak</div>
              <div className="text-xs text-ink-soft">Sat · Mar 15 · 09:00 · Toothache</div>
            </div>
            <div className="rounded-full bg-success-sage/10 px-2.5 py-1 text-[11px] font-medium tracking-wider text-success-sage">
              Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
