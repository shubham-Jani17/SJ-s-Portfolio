import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteMessage,
  fetchMessages,
  updateMessage,
} from "../../api/client";
import { AdminCard, AdminPage } from "../components/AdminUi";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMessages(archived);
      setMessages(data);
    } catch (e) {
      setError(e.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [archived]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset selected message when switching tabs
  useEffect(() => {
    setSelectedId(null);
  }, [archived]);

  const selected = messages.find((m) => m.id === selectedId);

  const markRead = async (id) => {
    await updateMessage(id, { status: "read" });
    load();
  };

  const toggleArchive = async (id, current) => {
    await updateMessage(id, { archived: !current, status: "read" });
    setSelectedId(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    await deleteMessage(id);
    setSelectedId(null);
    load();
  };

  return (
    <AdminPage
      title="Contact messages"
      subtitle="Every contact form submission appears here as a message."
    >
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setArchived(false)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors cursor-pointer select-none ${
            !archived
              ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
              : "border-white/10 text-muted-foreground hover:text-foreground"
          }`}
        >
          Inbox
        </button>
        <button
          type="button"
          onClick={() => setArchived(true)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors cursor-pointer select-none ${
            archived
              ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
              : "border-white/10 text-muted-foreground hover:text-foreground"
          }`}
        >
          Archived
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {loading && <p className="text-muted-foreground">Loading messages…</p>}

      {!loading && messages.length === 0 && (
        <AdminCard>
          <p className="text-sm text-muted-foreground">
            {archived ? "No archived messages." : "No messages yet. Submissions from the contact form will appear here."}
          </p>
        </AdminCard>
      )}

      {!loading && messages.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {messages.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSelectedId(m.id);
                if (m.status === "unread") markRead(m.id);
              }}
              className="text-left rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all hover:border-white/15 relative overflow-hidden group shadow-sm flex flex-col justify-between min-h-[160px] cursor-pointer"
            >
              {/* Unread status badge glow */}
              {m.status === "unread" && (
                <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                </div>
              )}
              
              <div>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <span className="text-base font-semibold text-foreground font-display group-hover:text-cyan-300 transition-colors">
                    {m.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{m.email}</p>
                <p className="text-xs text-foreground/75 mt-3 line-clamp-3 leading-relaxed">
                  {m.message}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Read message →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal Message Overlay */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl z-10"
            >
              <AdminCard className="!mb-0 shadow-[0_20px_50px_rgba(0,0,0,0.7),_0_0_30px_rgba(157,76,221,0.06)] border border-white/10 relative">
                
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none font-bold"
                  aria-label="Close message"
                >
                  ✕
                </button>

                <div className="flex flex-wrap items-start justify-between gap-3 mb-6 pr-8">
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {selected.name}
                    </h2>
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-sm text-cyan-400/90 hover:underline break-all"
                    >
                      {selected.email}
                    </a>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      {new Date(selected.createdAt).toLocaleString()}
                      {selected.status === "unread" && (
                        <span className="ml-2 text-cyan-400 font-semibold">• unread</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleArchive(selected.id, selected.archived)}
                      className="text-xs rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      {selected.archived ? "Restore to inbox" : "Archive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(selected.id)}
                      className="text-xs rounded-full border border-destructive/30 text-destructive px-3 py-1.5 hover:bg-destructive/10 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="font-mono-display text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
                  Message
                </p>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap max-h-[45vh] overflow-y-auto">
                  {selected.message}
                </div>
              </AdminCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
