# Webhooks And Uploads

## Delivery/Open Tracking (Default On)
Endpoint:
- `POST /api/webhooks/email-events`

Headers:
- `x-anchor-webhook-secret: <EMAIL_WEBHOOK_SECRET>`

Payload example:
```json
{
  "shareActionId": "uuid",
  "provider": "ses",
  "eventType": "delivered",
  "payload": {"messageId": "abc"},
  "occurredAt": "2026-03-27T19:30:00.000Z"
}
```

## Reply Parsing (Optional, Opt-In)
Endpoint:
- `POST /api/webhooks/replies`

Headers:
- `x-anchor-reply-secret: <REPLY_WEBHOOK_SECRET>`

Only parsed when `parse_replies_opt_in = true` for that share action.

## File Upload Flow
1. `POST /api/assets/presign` to get pre-signed URL and storage key.
2. Upload file with `PUT` to the pre-signed URL.
3. `POST /api/assets/complete` to register asset metadata and link to record.

Limits:
- Max file size in presign route: 50 MB.
