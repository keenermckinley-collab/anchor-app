"use client";

import { FormEvent, useState } from "react";

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "uploading"; id: string; submittedAt: string; totalFiles: number; uploaded: number }
  | { status: "success"; id: string; submittedAt: string; uploadedFiles: number }
  | { status: "error"; message: string };

export function AddRecordForm() {
  const [state, setState] = useState<SaveState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "saving" });

    const form = new FormData(event.currentTarget);
    const files = form
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const payload = {
      whatHappened: String(form.get("what") ?? "").trim(),
      whoWasInvolved: String(form.get("involved") ?? "").trim() || undefined,
      witnesses: String(form.get("witnesses") ?? "").trim() || undefined,
    };

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to save record.");
      }

      const recordId: string = body.record.id;
      const submittedAt: string = body.record.submitted_at;

      if (files.length > 0) {
        let uploaded = 0;
        setState({ status: "uploading", id: recordId, submittedAt, totalFiles: files.length, uploaded });
        for (const file of files) {
          const presignRes = await fetch("/api/assets/presign", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type || "application/octet-stream",
              sizeBytes: file.size,
            }),
          });
          const presignBody = await presignRes.json();
          if (!presignRes.ok) {
            throw new Error(presignBody?.error ?? "Unable to upload file.");
          }

          const uploadRes = await fetch(presignBody.uploadUrl, {
            method: "PUT",
            headers: { "content-type": file.type || "application/octet-stream" },
            body: file,
          });
          if (!uploadRes.ok) throw new Error("Upload failed.");

          const completeRes = await fetch("/api/assets/complete", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              storageKey: presignBody.storageKey,
              fileName: file.name,
              contentType: file.type || "application/octet-stream",
              sizeBytes: file.size,
              recordId,
            }),
          });
          const completeBody = await completeRes.json();
          if (!completeRes.ok) {
            throw new Error(completeBody?.error ?? "Unable to finalize upload.");
          }

          uploaded += 1;
          setState({ status: "uploading", id: recordId, submittedAt, totalFiles: files.length, uploaded });
        }
        setState({ status: "success", id: recordId, submittedAt, uploadedFiles: files.length });
      } else {
        setState({ status: "success", id: recordId, submittedAt, uploadedFiles: 0 });
      }
      event.currentTarget.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save record.";
      setState({ status: "error", message });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="what">What happened?</label>
      <textarea id="what" name="what" required />

      <label htmlFor="involved">Who was involved?</label>
      <textarea id="involved" name="involved" />

      <label htmlFor="witnesses">Were there witnesses?</label>
      <textarea id="witnesses" name="witnesses" />

      <label htmlFor="files">Add supporting files (optional)</label>
      <input id="files" name="files" type="file" multiple />

      <p className="callout">
        Once you save this record, it will be time-stamped and added to your timeline. You won't be able
        to edit it later, but you can add more information.
      </p>

      <div className="actions">
        <button className="btn primary" type="submit" disabled={state.status === "saving" || state.status === "uploading"}>
          {state.status === "saving" ? "Saving..." : state.status === "uploading" ? "Uploading files..." : "Save record"}
        </button>
      </div>

      {state.status === "success" && (
        <p className="small">
          Saved. Record ID {state.id} at {new Date(state.submittedAt).toLocaleString()}. Uploaded files: {state.uploadedFiles}.
        </p>
      )}
      {state.status === "uploading" && (
        <p className="small">
          Record saved. Uploading files ({state.uploaded}/{state.totalFiles})...
        </p>
      )}
      {state.status === "error" && <p className="small">{state.message}</p>}
    </form>
  );
}
