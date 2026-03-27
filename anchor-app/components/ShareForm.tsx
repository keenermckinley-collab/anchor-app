"use client";

import { FormEvent, useState } from "react";

type ShareState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; id: string }
  | { status: "error"; message: string };

export function ShareForm() {
  const [state, setState] = useState<ShareState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "sending" });
    const form = new FormData(event.currentTarget);

    const payload = {
      recipientEmail: String(form.get("recipientEmail") ?? "").trim(),
      recipientRole: String(form.get("recipientRole") ?? "").trim() || undefined,
      messageBody: String(form.get("messageBody") ?? "").trim() || undefined,
      parseRepliesOptIn: form.get("parseRepliesOptIn") === "on",
    };

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Unable to create share action.");

      setState({ status: "success", id: body.shareAction.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create share action.";
      setState({ status: "error", message });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="recipientEmail">Recipient email</label>
      <input id="recipientEmail" name="recipientEmail" type="email" placeholder="hr@example.com" required />

      <label htmlFor="recipientRole">Recipient role</label>
      <input id="recipientRole" name="recipientRole" type="text" placeholder="HR, legal advisor, etc." />

      <label htmlFor="messageBody">Message body</label>
      <textarea
        id="messageBody"
        name="messageBody"
        defaultValue="Please find my report attached. Please confirm receipt once reviewed."
      />

      <label>
        <input type="checkbox" name="parseRepliesOptIn" /> Enable reply parsing to detect receipt
        confirmation (optional, off by default)
      </label>
      <p className="small">Delivery and open tracking is enabled automatically through webhooks.</p>

      <div className="actions">
        <button className="btn primary" type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Generating..." : "Generate report"}
        </button>
      </div>

      {state.status === "success" && <p className="small">Share action created: {state.id}</p>}
      {state.status === "error" && <p className="small">{state.message}</p>}
    </form>
  );
}
