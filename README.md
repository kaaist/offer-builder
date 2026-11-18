# Transformational Offer Builder

A free, voice-first tool by [DIY Genius](https://www.diygenius.com) that walks experts through the 7 Ps of Productize Your Genius (Purpose, Prospect, Problem, Promise, Process, Profit, Program) and creates:

1. A one-page offer summary
2. A full multi-page offer doc
3. A CLAUDE.md or ChatGPT project file so AI knows the business

Live at **https://www.diygenius.com/offer-builder/** (embedded from GitHub Pages).

## Files

- `index.html` · the whole tool in one file (HTML, CSS, JS and screenshots)
- `offer-sheet.ts` · optional Supabase Edge Function that writes the offer sheet and doc with Claude

## Turning on the AI writing step

Without it, the tool builds the outputs straight from people's answers.

1. Deploy `offer-sheet.ts` as a Supabase Edge Function: `supabase functions deploy offer-sheet --no-verify-jwt`
2. Add the key: `supabase secrets set ANTHROPIC_API_KEY=...`
3. Set `AI_ENDPOINT` near the top of the script in `index.html` to the function URL and push.
