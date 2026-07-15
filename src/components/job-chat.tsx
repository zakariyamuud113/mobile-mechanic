import { useEffect, useRef, useState } from "react";
import { Send, X, Loader2 } from "lucide-react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  senderUid: string;
  senderName: string;
  createdAt?: Timestamp;
}

/**
 * Firestore-backed chat panel scoped to a single job.
 * Messages live in `jobs/{jobId}/messages` and stream in real time to both
 * the customer and the assigned mechanic.
 */
export function JobChat({
  jobId,
  peerLabel,
  onClose,
}: {
  jobId: string;
  peerLabel: string;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const q = query(
      collection(getDb(), "jobs", jobId, "messages"),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) })),
      );
      requestAnimationFrame(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
      });
    });
    return () => unsub();
  }, [jobId]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !profile) return;
    setSending(true);
    try {
      await addDoc(collection(getDb(), "jobs", jobId, "messages"), {
        text,
        senderUid: profile.uid,
        senderName: profile.name,
        createdAt: serverTimestamp(),
      });
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex h-[70vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-border bg-background sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Chat</p>
            <p className="font-semibold">{peerLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scroller} className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="pt-8 text-center text-xs text-muted-foreground">
              No messages yet. Say hello 👋
            </p>
          )}
          {messages.map((m) => {
            const mine = m.senderUid === profile?.uid;
            return (
              <div
                key={m.id}
                className={cn("flex w-full", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                  )}
                >
                  {!mine && (
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide opacity-70">
                      {m.senderName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap leading-snug">{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
