import { Client, auth } from "twitter-api-sdk";

const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_CLIENT_ID!,
  client_secret: process.env.TWITTER_CLIENT_SECRET!,
  callback: "",
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});

export const twitterClient = new Client(authClient);
