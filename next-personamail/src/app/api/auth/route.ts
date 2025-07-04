
import { betterAuth } from "better-auth";
import { NextRequest } from "next/server";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: "./sqlite.db",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send"
      ],
    },
  },
});

export const { GET, POST } = auth.handler;
