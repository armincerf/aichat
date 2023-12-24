## Running the app locally

### Environment configuration

This project uses an `.env` file to configure both the PartyKit server and the Next.js app.

For local development, copy `.env.example` file to `.env`, and populate OpenAI API environment variables.

Then run the PartyKit server and run the app:

```sh
npx partykit dev
npm run dev
```

Visit [localhost:3000](http://localhost:3000) in your browser.

## Deployment

### PartyKit


```sh
npx partykit deploy
```

### Next.js app deployment

When you're ready to deploy the Next.js app, you'll need to configure the `NEXT_PUBLIC_PARTYKIT_HOST` in your web hosting platform (e.g. Vercel) to point to the deployed PartyKit server address.

```conf
NEXT_PUBLIC_PARTYKIT_HOST=spatial-chat.{your-github-username}.partykit.dev
```
# juxtchat
