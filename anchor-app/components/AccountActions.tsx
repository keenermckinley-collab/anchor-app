"use client";

import { useState } from "react";

type State = { message?: string; error?: string; loading?: boolean };

export function AccountActions() {
  const [state, setState] = useState<State>({});

  async function exportData() {
    setState({ loading: true });
    try {
      const response = await fetch("/api/account/export");
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Export failed.");
      setState({ message: `Export ready with ${body.records?.length ?? 0} records.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed.";
      setState({ error: message });
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm("Delete account request? This will start data deletion.");
    if (!confirmed) return;

    setState({ loading: true });
    try {
      const response = await fetch("/api/account/delete", { method: "DELETE" });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error ?? "Delete request failed.");
      setState({ message: body.message });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete request failed.";
      setState({ error: message });
    }
  }

  return (
    <div className="actions">
      <button type="button" className="btn" onClick={exportData} disabled={state.loading}>
        Export my data
      </button>
      <button type="button" className="btn" onClick={deleteAccount} disabled={state.loading}>
        Delete my account
      </button>
      {state.message && <p className="small">{state.message}</p>}
      {state.error && <p className="small">{state.error}</p>}
    </div>
  );
}
