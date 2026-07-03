"use client";

import { useState } from "react";

const field =
  "border-b border-cream/40 bg-transparent pb-2 text-cream outline-none transition-colors " +
  "focus:border-cream focus-visible:outline-cream";

/**
 * Footer contact form. Presentational only this pass — submit is inert (no backend).
 * // TODO: wire to an email/CRM endpoint.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="flex h-full flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-name" className="text-caption text-cream/80">
          Name
        </label>
        <input id="cf-name" name="name" type="text" autoComplete="name" className={field} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-email" className="text-caption text-cream/80">
          Email
        </label>
        <input id="cf-email" name="email" type="email" autoComplete="email" className={field} />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="cf-message" className="text-caption text-cream/80">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          className={`min-h-[6rem] flex-1 resize-y ${field}`}
        />
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center self-start rounded-[10px] border border-cream px-[clamp(1.25rem,1.9vw,2rem)] py-[clamp(0.6rem,1vw,0.9rem)] text-btn leading-none text-cream transition-colors duration-200 hover:bg-cream hover:text-wine focus-visible:outline-cream"
      >
        {sent ? "Thank you" : "Send message"}
      </button>

      {sent && (
        <p role="status" className="text-caption text-cream/80">
          Thanks — this form is a presentational placeholder for now.
        </p>
      )}
    </form>
  );
}
