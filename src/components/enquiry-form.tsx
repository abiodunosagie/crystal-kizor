"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { contact } from "@/lib/content";
import { enquiryTopics } from "@/lib/enquiry-topics";
import { track } from "@/lib/track";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const field =
  "mt-1 block w-full border-0 border-b border-cream/35 bg-transparent px-0 py-3 text-cream placeholder:text-cream/45 focus:border-earth-soft focus:outline-none focus:ring-0";

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="text-[0.95rem] font-semibold">{label}</span>
      {children}
    </label>
  );
}

function EmailFallback() {
  return (
    <p className="text-[0.95rem] text-cream/75 max-md:text-center">
      Or email{" "}
      <a href={`mailto:${contact.email}`} className="font-semibold text-cream underline underline-offset-4 hover:text-earth-soft">
        {contact.email}
      </a>
    </p>
  );
}

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // The form only works with JavaScript; until it has loaded (or without it)
  // visitors see the email address instead of a form that would go nowhere.
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const openedAt = useRef(0);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const resumeRef = useRef(false);

  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (status.state === "sent") thanksRef.current?.focus();
    // After "Send another message" the form remounts; keep keyboard users in it.
    if (status.state === "idle" && resumeRef.current) {
      resumeRef.current = false;
      topicRef.current?.focus();
    }
  }, [status.state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // How long the form was open, measured on this device only.
        body: JSON.stringify({ ...data, elapsed: Math.round(performance.now() - openedAt.current) }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setStatus({ state: "error", message: body.error ?? "We could not send that just now. Please try again." });
        return;
      }
      track("generate_lead", { location: "enquiry_form", lead_type: String(data.topic ?? "general") });
      form.reset();
      setStatus({ state: "sent" });
    } catch {
      setStatus({ state: "error", message: "No connection. Please try again, or email us directly." });
    }
  }

  const sending = status.state === "sending";
  return (
    <div>
      {/* Errors are announced here; success moves focus to the thank-you heading. */}
      <p aria-live="polite" className="sr-only">
        {status.state === "error" ? status.message : ""}
      </p>

      {!ready ? (
        <EmailFallback />
      ) : status.state === "sent" ? (
        <div className="border-t border-cream/30 pt-8 max-md:text-center">
          <h4 ref={thanksRef} tabIndex={-1} className="display text-[2rem] leading-tight outline-none md:text-[2.4rem]">
            Thank you. Your message is on its way.
          </h4>
          <p className="mt-4 text-cream/75">A reply will come to the email address you gave.</p>
          <button
            type="button"
            onClick={() => {
              resumeRef.current = true;
              setStatus({ state: "idle" });
              openedAt.current = performance.now();
            }}
            className="mt-8 font-semibold text-earth-soft underline-offset-4 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-8 text-left md:grid-cols-2 md:gap-x-10">
          <Field label="I’m writing about" wide>
            <select ref={topicRef} name="topic" required defaultValue="studio_project" className={`${field} cursor-pointer [&>option]:text-ink`}>
              {enquiryTopics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Name">
            <input name="name" required maxLength={120} autoComplete="name" className={field} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} />
          </Field>
          <Field label="Message" wide>
            <textarea
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={4}
              placeholder="A few lines about what you have in mind"
              className={`${field} resize-y`}
            />
          </Field>

          {/* Left empty by people; filled in by most form-filling bots. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-cream px-8 py-4 font-semibold text-ink transition-colors hover:bg-earth-soft disabled:opacity-60 md:w-auto"
            >
              {sending ? "Sending" : "Send message"}
            </button>
            <EmailFallback />
          </div>

          {status.state === "error" ? <p className="text-[0.95rem] text-earth-soft md:col-span-2">{status.message}</p> : null}
        </form>
      )}
    </div>
  );
}
