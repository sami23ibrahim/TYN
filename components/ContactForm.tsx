"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { submitEnquiry } from "@/app/actions/enquiry";
import {
  EVENT_DURATIONS,
  EVENT_TYPES,
  MIN_LEAD_DAYS,
  initialEnquiryState,
  isoDaysFromToday,
  type FieldErrors,
  type FieldName,
} from "@/lib/enquiry";

const field =
  "border-b border-cream/40 bg-transparent pb-2 text-cream outline-none transition-colors " +
  "focus:border-cream focus-visible:outline-cream";

const fieldInvalid = "border-b border-red-200 bg-transparent pb-2 text-cream outline-none";

// Native dropdowns paint their popup with the OS palette, so the options need an explicit
// light background — cream-on-cream would be invisible.
const option = "bg-cream text-wine";

/** Submit button — split out so useFormStatus can read the enclosing form's pending state. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center self-start rounded-[10px] border border-cream px-[clamp(1.25rem,1.9vw,2rem)] py-[clamp(0.6rem,1vw,0.9rem)] text-btn leading-none text-cream transition-colors duration-200 hover:bg-cream hover:text-wine focus-visible:outline-cream disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send enquiry"}
    </button>
  );
}

/** Inline error under a field. Nothing renders when the field is valid. */
function FieldError({ errors, name }: { errors: FieldErrors | undefined; name: FieldName }) {
  if (!errors?.[name]) return null;
  return (
    <p id={`cf-${name}-error`} className="text-caption text-red-200">
      {errors[name]}
    </p>
  );
}

/**
 * Footer enquiry form. Submits to the `submitEnquiry` server action, which emails the
 * enquiry to TÝN and sends the customer a confirmation.
 *
 * Errors come back from the server with the submitted values attached, so a failed submit
 * re-renders the form as the customer left it rather than blanking nine fields.
 */
export default function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialEnquiryState);
  const { errors, values } = state;

  // The date floor is applied to the DOM after mount rather than rendered, for two
  // reasons: the page is statically prerendered, so a server-computed `min` would freeze
  // at build time; and server and client can straddle midnight, which would be a
  // hydration mismatch. Writing the attribute directly (not via state) keeps this a
  // one-off DOM touch instead of a second render pass. The server validates the lead
  // time regardless, so nothing depends on this attribute existing.
  const dateRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = isoDaysFromToday(MIN_LEAD_DAYS);
  }, []);

  /** Wire a field to its error state: styling, aria, and the value to restore. */
  const bind = (name: FieldName) => ({
    name,
    defaultValue: values?.[name] ?? "",
    className: errors?.[name] ? fieldInvalid : field,
    "aria-invalid": errors?.[name] ? (true as const) : undefined,
    "aria-describedby": errors?.[name] ? `cf-${name}-error` : undefined,
  });

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-1 flex-col justify-center gap-4">
        <p className="text-body text-cream">Thank you — your enquiry is on its way.</p>
        <p className="text-caption text-cream/80">
          We have sent a confirmation to your inbox and will come back to you within 48
          hours.
        </p>
      </div>
    );
  }

  return (
    // Native validation stays on as the instant first pass; the server action is the
    // actual gate, since anything can POST to it.
    <form
      action={formAction}
      className="flex flex-1 flex-col gap-[clamp(1.25rem,2.5vw,1.75rem)]"
    >
      {/* Honeypot. Hidden from sight and from assistive tech, skipped by tabbing, and
          never autofilled — anything in it came from a bot. Not `display:none`, which
          some bots detect and skip. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-[clamp(1.25rem,2.5vw,1.75rem)] sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="cf-name" className="text-caption text-cream/80">
            Name and surname
          </label>
          <input id="cf-name" type="text" autoComplete="name" required {...bind("name")} />
          <FieldError errors={errors} name="name" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-email" className="text-caption text-cream/80">
            E-mail
          </label>
          <input id="cf-email" type="email" autoComplete="email" required {...bind("email")} />
          <FieldError errors={errors} name="email" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-phone" className="text-caption text-cream/80">
            Phone number
          </label>
          <input id="cf-phone" type="tel" autoComplete="tel" required {...bind("phone")} />
          <FieldError errors={errors} name="phone" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-date" className="text-caption text-cream/80">
            Date
          </label>
          <input
            id="cf-date"
            ref={dateRef}
            type="date"
            required
            {...bind("date")}
            className={`[color-scheme:dark] ${errors?.date ? fieldInvalid : field}`}
            aria-describedby={errors?.date ? "cf-date-error" : "cf-date-hint"}
          />
          {errors?.date ? (
            <FieldError errors={errors} name="date" />
          ) : (
            <p id="cf-date-hint" className="text-caption text-cream/60">
              At least one week from today.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-people" className="text-caption text-cream/80">
            Number of people
          </label>
          <input id="cf-people" type="number" min={1} required {...bind("people")} />
          <FieldError errors={errors} name="people" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-budget" className="text-caption text-cream/80">
            Budget
          </label>
          <input id="cf-budget" type="text" {...bind("budget")} />
          <FieldError errors={errors} name="budget" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-place" className="text-caption text-cream/80">
            Place
          </label>
          <input id="cf-place" type="text" required {...bind("place")} />
          <FieldError errors={errors} name="place" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-eventType" className="text-caption text-cream/80">
            Event type
          </label>
          <select id="cf-eventType" required {...bind("eventType")}>
            <option value="" disabled className={option}>
              Select…
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} className={option}>
                {t}
              </option>
            ))}
          </select>
          <FieldError errors={errors} name="eventType" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cf-eventDuration" className="text-caption text-cream/80">
            Event duration
          </label>
          <select id="cf-eventDuration" required {...bind("eventDuration")}>
            <option value="" disabled className={option}>
              Select…
            </option>
            {EVENT_DURATIONS.map((d) => (
              <option key={d} value={d} className={option}>
                {d}
              </option>
            ))}
          </select>
          <FieldError errors={errors} name="eventDuration" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="cf-note" className="text-caption text-cream/80">
          Note
        </label>
        <textarea
          id="cf-note"
          rows={4}
          {...bind("note")}
          className={`min-h-[6rem] flex-1 resize-y ${errors?.note ? fieldInvalid : field}`}
        />
        <FieldError errors={errors} name="note" />
      </div>

      <SubmitButton />

      {state.status === "error" && state.message && (
        <p role="alert" className="text-caption text-red-200">
          {state.message}
        </p>
      )}
    </form>
  );
}
