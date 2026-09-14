import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
// import { db } from "./db"; // your drizzle instance
// import { ac, admin, manager, user } from "./auth/permissions";
// import { SendVerificationEmail } from "./mail/send-verification-email";
import { db } from "./db";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  // baseURL:
  //   process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://kintehobe.vercel.app",
  // trustedOrigins: ["https://kintehobe.vercel.app", "http://localhost:3000"],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  // emailVerification:{
  //     sendOnSignUp:true,
  //     sendVerificationEmail:async ({user,url})=>{
  //         await SendVerificationEmail({
  //             user,url
  //         });
  //     }
  // },
});

export async function getServerSession(requestHeaders: Headers) {
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch {
    return null;
  }
}
