/**
 * The enquiry form's shape and rules — no I/O, no framework. The form component and the
 * server action both import from here so there is exactly one definition of what a valid
 * enquiry is; the browser's `required`/`type=email` attributes are a convenience, not the
 * gate, since anything can POST to a server action.
 */

export const EVENT_TYPES = [
  "Wedding",
  "Corporate event",
  "Private dinner",
  "Birthday / celebration",
  "Other",
] as const;

export const EVENT_DURATIONS = [
  "Full day",
  "Half day",
  "Evening catering",
] as const;

/** Lead time we ask for on the date field. */
export const MIN_LEAD_DAYS = 7;

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  date: string;
  people: string;
  budget: string;
  place: string;
  eventType: string;
  eventDuration: string;
  note: string;
};

export type FieldName = keyof Enquiry;

export type FieldErrors = Partial<Record<FieldName, string>>;

/**
 * What the form renders from, and what the server action returns.
 *
 * This lives here rather than beside the action because a `"use server"` module may only
 * export async functions — a plain constant there is a build error.
 */
export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  values?: Partial<Enquiry>;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };

/** Field order used for the emails, so both read in the same order as the form. */
export const FIELD_LABELS: Array<[FieldName, string]> = [
  ["name", "Name"],
  ["email", "E-mail"],
  ["phone", "Phone"],
  ["date", "Date"],
  ["people", "Number of people"],
  ["eventType", "Event type"],
  ["eventDuration", "Event duration"],
  ["place", "Place"],
  ["budget", "Budget"],
  ["note", "Note"],
];

/** Today + `days`, as YYYY-MM-DD. Used for the date input's `min`. */
export function isoDaysFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const PHONE_RE = /^[+\d][\d\s()\-.]{4,39}$/;

function str(formData: FormData, key: FieldName): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export type ParseResult =
  | { ok: true; data: Enquiry }
  | { ok: false; errors: FieldErrors; values: Enquiry };

/**
 * Validate raw form data. On failure the submitted values come back alongside the errors
 * so the form can be re-rendered without the customer retyping nine fields.
 */
export function parseEnquiry(formData: FormData): ParseResult {
  const values: Enquiry = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    date: str(formData, "date"),
    people: str(formData, "people"),
    budget: str(formData, "budget"),
    place: str(formData, "place"),
    eventType: str(formData, "eventType"),
    eventDuration: str(formData, "eventDuration"),
    note: str(formData, "note"),
  };

  const errors: FieldErrors = {};

  if (values.name.length < 2) errors.name = "Please enter your name.";
  else if (values.name.length > 100) errors.name = "That name is too long.";

  if (!EMAIL_RE.test(values.email) || values.email.length > 200)
    errors.email = "Please enter a valid e-mail address.";

  if (!PHONE_RE.test(values.phone))
    errors.phone = "Please enter a valid phone number.";

  // The client asks for MIN_LEAD_DAYS. The server allows one extra day of slack: the
  // browser computes `min` in the visitor's timezone and this runs in the server's, so a
  // date that was exactly on the boundary when picked must not be rejected on submit.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    errors.date = "Please choose a date.";
  } else if (values.date < isoDaysFromToday(MIN_LEAD_DAYS - 1)) {
    errors.date = `Please choose a date at least ${MIN_LEAD_DAYS} days from today.`;
  }

  const people = Number(values.people);
  if (!Number.isInteger(people) || people < 1 || people > 2000)
    errors.people = "Please enter a number of guests between 1 and 2000.";

  if (values.budget.length > 100) errors.budget = "That budget note is too long.";

  if (values.place.length < 2) errors.place = "Please tell us where the event is.";
  else if (values.place.length > 200) errors.place = "That place is too long.";

  if (!(EVENT_TYPES as readonly string[]).includes(values.eventType))
    errors.eventType = "Please choose an event type.";

  if (!(EVENT_DURATIONS as readonly string[]).includes(values.eventDuration))
    errors.eventDuration = "Please choose an event duration.";

  if (values.note.length > 5000) errors.note = "Please shorten your note.";

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };
  return { ok: true, data: values };
}
