"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/lib/content";
import { track } from "@/lib/track";

const topics = [
  { value: "studio_project", label: "A project with Studio COKA" },
  { value: "speaking", label: "Speaking or media" },
  { value: "ako_partner", label: "Partnering with AKO Alliance" },
  { value: "tea", label: "The Effective Architect" },
  { value: "elevated", label: "ELEvated furniture" },
  { value: "general", label: "Something else" },
];

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const field =
  "block w-full border-0 border-b border-cream/35 bg-transparent px-0 py-3 text-cream placeholder:text-cream/45 focus:border-earth-soft focus:outline-none focus:ring-0";

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, started: started.current }),
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

  if (status.state === "sent") {
    return (
      <div role="status" className="border-t border-cream/30 pt-8">
        <p className="display text-[2rem] leading-tight md:text-[2.4rem]">Thank you. Your message is on its way.</p>
        <p className="mt-4 text-cream/75">A reply will come to the email address you gave.</p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-8 font-semibold text-earth-soft underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";
  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid grid-cols-1 gap-8 text-left md:grid-cols-2 md:gap-x-10">
      <label className="block md:col-span-2">
        <span className="text-[0.95rem] font-semibold">I&rsquo;m writing about</span>
        <select name="topic" required defaultValue="studio_project" className={`${field} mt-1 cursor-pointer [&>option]:text-ink`}>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-[0.95rem] font-semibold">Name</span>
        <input name="name" required maxLength={120} autoComplete="name" className={`${field} mt-1`} />
      </label>
      <label className="block">
        <span className="text-[0.95rem] font-semibold">Email</span>
        <input name="email" type="email" required maxLength={200} autoComplete="email" className={`${field} mt-1`} />
      </label>
      <label className="block md:col-span-2">
        <span className="text-[0.95rem] font-semibold">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          placeholder="A few lines about what you have in mind"
          className={`${field} mt-1 resize-y`}
        />
      </label>

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
        <p className="text-[0.95rem] text-cream/75 max-md:text-center">
          Or email{" "}
          <a href={`mailto:${contact.email}`} className="font-semibold text-cream underline underline-offset-4 hover:text-earth-soft">
            {contact.email}
          </a>
        </p>
      </div>

      <p aria-live="polite" className="text-[0.95rem] text-earth-soft md:col-span-2">
        {status.state === "error" ? status.message : ""}
      </p>
    </form>
  );
}
