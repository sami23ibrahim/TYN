"use client";

import { useEffect, useState } from "react";

const field =
  "border-b border-cream/40 bg-transparent pb-2 text-cream outline-none transition-colors " +
  "focus:border-cream focus-visible:outline-cream";

// Native dropdowns paint their popup with the OS palette, so the options need an explicit
// light background — cream-on-cream would be invisible.
const option = "bg-cream text-wine";

const EVENT_TYPES = [
  "Wedding",
  "Corporate event",
  "Private dinner",
  "Birthday / celebration",
  "Other",
];

const EVENT_DURATIONS = ["Full day", "Half day", "Evening catering"];

/** Today + 7 days as YYYY-MM-DD, for the date input's `min`. */
function oneWeekFromToday() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Footer enquiry form. Presentational only this pass — submit is inert (no backend).
 * // TODO: wire to an email/CRM endpoint.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  // Set after mount: the server and the client can straddle midnight, and a differing
  // `min` between the two renders would trip a hydration mismatch.
  const [minDate, setMinDate] = useState("");
  useEffect(() => setMinDate(oneWeekFromToday()), []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex h-full flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]"
    >
      <div className="grid gap-[clamp(1.25rem,2.5vw,1.75rem)] sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="cf-name" className="text-caption text-cream/80">
            Name and surname
          </label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-email" className="text-caption text-cream/80">
            E-mail
          </label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-phone" className="text-caption text-cream/80">
            Phone number
          </label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-date" className="text-caption text-cream/80">
            Date
          </label>
          <input
            id="cf-date"
            name="date"
            type="date"
            min={minDate}
            required
            aria-describedby="cf-date-hint"
            className={`[color-scheme:dark] ${field}`}
          />
          <p id="cf-date-hint" className="text-caption text-cream/60">
            At least one week from today.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-people" className="text-caption text-cream/80">
            Number of people
          </label>
          <input id="cf-people" name="people" type="number" min={1} required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-budget" className="text-caption text-cream/80">
            Budget
          </label>
          <input id="cf-budget" name="budget" type="text" className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-place" className="text-caption text-cream/80">
            Place
          </label>
          <input id="cf-place" name="place" type="text" required className={field} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-event-type" className="text-caption text-cream/80">
            Event type
          </label>
          <select id="cf-event-type" name="eventType" defaultValue="" required className={field}>
            <option value="" disabled className={option}>
              Select…
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} className={option}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-duration" className="text-caption text-cream/80">
            Event duration
          </label>
          <select id="cf-duration" name="eventDuration" defaultValue="" required className={field}>
            <option value="" disabled className={option}>
              Select…
            </option>
            {EVENT_DURATIONS.map((d) => (
              <option key={d} value={d} className={option}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="cf-note" className="text-caption text-cream/80">
          Note
        </label>
        <textarea
          id="cf-note"
          name="note"
          rows={4}
          className={`min-h-[6rem] flex-1 resize-y ${field}`}
        />
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center self-start rounded-[10px] border border-cream px-[clamp(1.25rem,1.9vw,2rem)] py-[clamp(0.6rem,1vw,0.9rem)] text-btn leading-none text-cream transition-colors duration-200 hover:bg-cream hover:text-wine focus-visible:outline-cream"
      >
        {sent ? "Thank you" : "Send enquiry"}
      </button>

      {sent && (
        <p role="status" className="text-caption text-cream/80">
          Thanks — this form is a presentational placeholder for now.
        </p>
      )}
    </form>
  );
}
