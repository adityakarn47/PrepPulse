"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exist. Please sign in   ",
      };
    }
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: unknown) {
    console.log("error -------->>>", error);
    if ((error as { code?: string })?.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already in use",
      };
    }
    return {
      success: false,
      message: "Fail to create account ",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User not exists. Create Account ",
      };
    }
    await setSessionCookies(idToken);
  } catch (error) {
    console.log("error -------->>>", error);
    return {
      success: false,
      message: "Fail to Sign in ",
    };
  }
}

export async function setSessionCookies(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookies = await auth.createSessionCookie(idToken, {
    expiresIn: WEEK * 1000,
  });

  cookieStore.set("session", sessionCookies, {
    maxAge: WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookies = cookieStore.get("session")?.value;
  if (!sessionCookies) return null;
  try {
    const decodeClaims = await auth.verifySessionCookie(sessionCookies, true);
    const userRecord = await db.collection("users").doc(decodeClaims.uid).get();
    if (!userRecord.exists) return null;
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function isAuthenticate() {
  const user = await getCurrentUser();
  return !!user;
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error) {
    console.log("error -------->>>", error);
    return {
      success: false,
      message: "Failed to sign out",
    };
  }
}
