# Megawatt Report landing page — deploy in 4 commands

This folder is a complete site: `index.html` (the page) + `api/subscribe.js`
(the serverless function that talks to beehiiv). Vercel picks both up
automatically with zero config.

## Deploy

1. Create the API key: beehiiv → Settings → Integrations → API → New API key (v2). Copy it.
2. In this folder:
   ```
   npm i -g vercel        # once
   vercel login           # once
   vercel --prod
   vercel env add BEEHIIV_API_KEY production   # paste the key when prompted
   vercel --prod          # redeploy so the function picks up the key
   ```
   (Or drag this folder into vercel.com/new and add the env var in the dashboard.)

## Then, in beehiiv (once)
- Open the automation email and add the report link or file block:
  https://app.beehiiv.com/automations/8ec5ca18-2868-4beb-9f45-e66a17d40fda/workflow
- Publish the automation (it's a draft until you do).

## Test
Visit the deployed URL, submit your own email, confirm:
tag `megawatt report` applied + report email arrives + link works.

## Ad URLs
Point ads at `https://your-deployment-url/?utm_source=x` or `?utm_source=linkedin`
— the split shows up on each subscriber in beehiiv.

## Note
The beehiiv subscribe form "Megawatt Report Landing Page" created earlier is now
unused (this page posts via the API instead). Ignore it, or delete it in the
beehiiv dashboard if you want zero clutter.
