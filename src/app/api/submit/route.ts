import { z } from "zod";
import { getBank } from "@/lib/content";
import { answerSchema } from "@/lib/contracts";
import { advance, verify } from "@/lib/engine";
import { body, failure } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const input = await body(
      request,
      z.object({ token: z.string().max(24000), answers: answerSchema }),
    );
    return Response.json(
      advance(verify(input.token), input.answers, await getBank()),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return failure(e);
  }
}
