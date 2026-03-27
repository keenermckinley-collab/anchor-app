export type DeliveryStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "bounced"
  | "failed";

export type SharePayload = {
  reportId: string;
  recipientEmail: string;
  recipientRole?: string;
  messageBody?: string;
  parseRepliesOptIn?: boolean;
};
