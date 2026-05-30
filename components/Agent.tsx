"use client";

import { cn } from "@/lib/utils";
import { User2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.actions";
import { reserveDailyCall } from "@/lib/actions/general.actions";
import { toast } from "sonner";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  // const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (e: Error) => console.log("e -------->>>", e);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = useCallback(
    async (messages: SavedMessage[]) => {
      // console.log("Generate feedback here.");
      const { success, feedbackId } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
      });

      if (success && feedbackId) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    },
    [interviewId, userId, router]
  );

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, router, handleGenerateFeedback]);

  const handleCall = async () => {
    // Reserve a daily call before starting
    try {
      if (!userId) {
        toast.error("You must be signed in to start a call.");
        return;
      }
      const kind = type === "generate" ? "generate" : "interview";
      const res = await reserveDailyCall({ userId: userId!, kind });
      if (!res.allowed) {
        setCallStatus(CallStatus.INACTIVE);
        toast.error(
          "Daily limit reached. Come back tomorrow for an interview."
        );
        return;
      }
      // Notify navbar to refresh usage count
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("usage:changed"));
      }
    } catch (e) {
      setCallStatus(CallStatus.INACTIVE);
      console.error(e);
      toast.error("Unable to start call right now. Please try again.");
      return;
    }

    setCallStatus(CallStatus.CONNECTING);
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!;

    if (type === "generate") {
      const options = {
        variableValues: {
          username: userName,
          userId: userId,
        },
      };
      await vapi.start(undefined, undefined, undefined, workflowId, options);
    } else {
      let formattedQuestions = "";
      if (questions && questions.length > 0) {
        formattedQuestions = questions
          .map((q: string, index: number) => `Q${index + 1}: ${q}`)
          .join("\n");
      }

      const options = {
        variableValues: {
          questions: formattedQuestions,
        },
      };
      await vapi.start(interviewer, undefined, undefined, undefined, options);
    }
  };
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  };

  const latestMessages = messages[messages.length - 1]?.content;
  const isCallStatusFinishedOrInactive =
    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="Vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>Ai Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            {/* <Image
            src="/user-avatar.png"
            alt="User"
            width={540}
            height={540}
            className="object-cover rounded-full size-[120px]"
          /> */}
            <User2Icon className="bg-accent p-4 rounded-full size-[120px]" />
            {isSpeaking && <span className="animate-speak" />}
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessages}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessages}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {isCallStatusFinishedOrInactive ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
