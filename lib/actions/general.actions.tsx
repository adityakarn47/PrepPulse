"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

// Daily call usage limit
const DAILY_CALL_LIMIT = 3;

type UsageKind = "generate" | "interview";

interface UsageDoc {
  userId: string;
  dateKey: string;
  total: number;
  generateCount: number;
  interviewCount: number;
  updatedAt?: string;
}

const getDateKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

export async function getDailyUsage(userId: string) {
  try {
    const dateKey = getDateKey();
    const docId = `${userId}_${dateKey}`;
    const docRef = db.collection("usage").doc(docId);
    const snap = await docRef.get();
    if (!snap.exists) {
      return {
        userId,
        dateKey,
        total: 0,
        generateCount: 0,
        interviewCount: 0,
        limit: DAILY_CALL_LIMIT,
        remaining: DAILY_CALL_LIMIT,
      };
    }
    const data = snap.data() as Partial<UsageDoc> | undefined;
    const total: number = data?.total ?? 0;
    return {
      userId,
      dateKey,
      total,
      generateCount: data?.generateCount ?? 0,
      interviewCount: data?.interviewCount ?? 0,
      limit: DAILY_CALL_LIMIT,
      remaining: Math.max(DAILY_CALL_LIMIT - total, 0),
    };
  } catch (e) {
    console.error("getDailyUsage error", e);
    return {
      userId,
      dateKey: getDateKey(),
      total: 0,
      generateCount: 0,
      interviewCount: 0,
      limit: DAILY_CALL_LIMIT,
      remaining: DAILY_CALL_LIMIT,
    };
  }
}

export async function reserveDailyCall(params: {
  userId: string;
  kind: UsageKind;
}) {
  const { userId, kind } = params;
  const dateKey = getDateKey();
  const docId = `${userId}_${dateKey}`;
  const docRef = db.collection("usage").doc(docId);

  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const initial: UsageDoc = snap.exists
        ? ({
            userId: (snap.data() as Partial<UsageDoc>)?.userId ?? userId,
            dateKey: (snap.data() as Partial<UsageDoc>)?.dateKey ?? dateKey,
            total: (snap.data() as Partial<UsageDoc>)?.total ?? 0,
            generateCount:
              (snap.data() as Partial<UsageDoc>)?.generateCount ?? 0,
            interviewCount:
              (snap.data() as Partial<UsageDoc>)?.interviewCount ?? 0,
            updatedAt: (snap.data() as Partial<UsageDoc>)?.updatedAt,
          } as UsageDoc)
        : {
            userId,
            dateKey,
            total: 0,
            generateCount: 0,
            interviewCount: 0,
          };

      const currentTotal: number = initial.total ?? 0;
      if (currentTotal >= DAILY_CALL_LIMIT) {
        return {
          allowed: false,
          total: currentTotal,
          remaining: 0,
          limit: DAILY_CALL_LIMIT,
        };
      }

      const updated: UsageDoc = { ...initial };
      updated.total = currentTotal + 1;
      if (kind === "generate")
        updated.generateCount = (initial.generateCount ?? 0) + 1;
      if (kind === "interview")
        updated.interviewCount = (initial.interviewCount ?? 0) + 1;
      updated.updatedAt = new Date().toISOString();

      tx.set(docRef, updated, { merge: true });

      return {
        allowed: true,
        total: updated.total,
        remaining: Math.max(DAILY_CALL_LIMIT - updated.total, 0),
        limit: DAILY_CALL_LIMIT,
      };
    });

    return result;
  } catch (e) {
    console.error("reserveDailyCall error", e);
    return { allowed: false, total: 0, remaining: 0, limit: DAILY_CALL_LIMIT };
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  try {
    const { userId, limit = 20 } = params;
    const interviewsSnapshot = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview;
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;
  try {
    const formattedTranscript = transcript
      .map(
        (sentance: { role: string; content: string }) =>
          `-  ${sentance.role}: ${sentance.content}\n`
      )
      .join("");

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Transform categoryScores from object to array format
    const categoryScoresArray = Object.entries(categoryScores).map(
      ([name, data]) => ({
        name:
          name === "culturalFit"
            ? "Cultural & Role Fit"
            : name === "technicalKnowledge"
            ? "Technical Knowledge"
            : name === "problemSolving"
            ? "Problem-Solving"
            : name === "confidence"
            ? "Confidence & Clarity"
            : name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        score: data.score,
        comment: data.comment,
      })
    );

    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores: categoryScoresArray,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });
    // let feedbackRef;

    // if (feedbackId) {
    //   feedbackRef = db.collection("feedback").doc(feedbackId);
    // } else {
    //   feedbackRef = db.collection("feedback").doc();
    // }

    // await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  try {
    const { interviewId, userId } = params;

    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    // console.log("Feedback snapshot empty?", feedbackSnapshot.empty);

    if (feedbackSnapshot.empty) {
      return null;
    }
    const feedbackDoc = feedbackSnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}
