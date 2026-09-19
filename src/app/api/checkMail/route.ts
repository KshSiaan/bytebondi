import { user } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Email query parameter is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const [row] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!row) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify({ exists: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
