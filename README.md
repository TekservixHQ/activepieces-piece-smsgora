# SMS Gora piece for Activepieces

<img src="logo.png" width="72" align="right" alt="SMS Gora">

**SMS Gora SMS Gateway** - Activepieces piece: send and receive SMS through your own Android phones. By Tekservix.

Send and receive SMS from your own Android phones inside [Activepieces](https://www.activepieces.com) flows, with [SMS Gora](https://tekservix.com/smsgora) by Tekservix.

**You need a Tekservix account with SMS Gora and at least one Android phone linked with the SMS Gora app.** The piece is a client of the public SMS Gora API: your plan, limits and phones are managed in your SMS Gora dashboard. [Create an account](https://tekservix.com/smsgora) · [API docs](https://tekservix.com/smsgora/docs/)

## Install

Activepieces installs community pieces from npm by package name:

1. Open **Settings → My Pieces → Install Piece** (on self-hosted Activepieces: **Platform Admin → Pieces → Install Piece**).
2. Choose **NPM registry** and type `activepieces-piece-smsgora`.
3. Click **Install**. SMS Gora now shows up in the piece list of the flow builder.

## Connect

1. In your SMS Gora dashboard open **SMS Gora → API keys** and click **Create key** (it starts with `sgk_`).
2. In Activepieces add an SMS Gora step, click **Create connection** and paste the key. It is checked against your account straight away.

## What it can do

| Type | Name | What it does |
| --- | --- | --- |
| Trigger | New SMS Event | Starts the flow when a phone receives an SMS, or a sent SMS is sent, delivered or fails. Registers its own webhook and checks the `X-SmsGora-Signature` HMAC on every call. |
| Action | Send SMS | One text to one or more numbers (up to 1,000), from a chosen phone and SIM, now or scheduled. |
| Action | Send Bulk SMS | Different texts to different people in one call (up to 5,000 recipients). |
| Action | Get Message | Status and details of one message. |
| Action | Cancel Message | Cancel a queued or scheduled message. |
| Action | Find Messages | Sent or received messages, filtered by status, number and date. |
| Action | Find Received SMS | Incoming SMS, for one phone or all of them. |
| Action | Get Phone / List Phones | Your linked phones, their status and battery. |
| Action | Get Account | Plan, limits and usage. |
| Action | Custom API Call | Any other SMS Gora API endpoint, with your key added for you. |

All actions are tagged for Activepieces AI agents and MCP, so an agent can text a customer or check delivery on its own.

## Example flows

- **New order → SMS:** Shopify / WooCommerce "New order" → SMS Gora *Send SMS* to the customer's phone.
- **SMS reply → CRM:** SMS Gora *New SMS Event* (SMS Received) → add a note in HubSpot or a row in Google Sheets.
- **Delivery report:** SMS Gora *New SMS Event* (SMS Failed) → Slack message to your team.

## Build from source

This repository holds only the piece. CI copies `piece/` into a pinned checkout of the Activepieces monorepo, then lints, builds and packs it with the official CLI (`npm run build-piece smsgora`), smoke-tests the packed bundle and publishes it to npm with provenance on version tags.

## Other SMS Gora integrations

[npm](https://www.npmjs.com/package/smsgora) · [PyPI](https://pypi.org/project/smsgora/) · [n8n](https://www.npmjs.com/package/n8n-nodes-smsgora) · [Node-RED](https://flows.nodered.org/node/node-red-contrib-smsgora) · [Zapier](https://tekservix.com/smsgora) · [All docs](https://tekservix.com/smsgora/docs/)

## Support

support@tekservix.com · [tekservix.com](https://tekservix.com)

MIT licensed.
