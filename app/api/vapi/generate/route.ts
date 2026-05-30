import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { z } from "zod";
import { reserveDailyCall } from "@/lib/actions/general.actions";

export async function GET() {
  return Response.json({ success: true, data: "Api call" }, { status: 200 });
}

export async function POST(req: Request) {
  // console.log("await req.json() -------->>>", await req.json());
  //   const { type, role, level, techstack, amount, userid } = await req.json();
  const { type, role, level, techstack, amount, userId } = await req.json();

  // Validate required fields
  if (!type || !role || !level || !techstack || !amount || !userId) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Enforce daily usage limit for generation as well
    const reserve = await reserveDailyCall({ userId, kind: "generate" });
    if (!reserve.allowed) {
      return Response.json(
        { success: false, error: "Daily limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    const { object: questions } = await generateObject({
      model: google("gemini-1.5-flash-latest"),
      schema: z.array(z.string()),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });
    // console.log("questions -------->>>", questions);

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: questions,
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("error -------->>>", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
