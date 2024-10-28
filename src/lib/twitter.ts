import { Client, auth } from "twitter-api-sdk";

export const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID!,
  client_secret: process.env.TWITTER_CLIENT_SECRET!,
  callback: "https://web-share-target-fun.vercel.app",
  scopes: ["tweet.read", "users.read", "offline.access"],
  token: {
    access_token: process.env.TWITTER_ACCESS_TOKEN!,
    refresh_token: process.env.TWITTER_REFRESH_TOKEN!,
  },
});

export const twitterClient = new Client(authClient);
