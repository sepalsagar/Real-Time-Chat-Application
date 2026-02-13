import { FormEvent, useMemo, useState } from "react";
import "./App.css";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
};

type ChatMessage = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "u_101",
    name: "Priya Sharma",
    lastMessage: "Let's lock the release notes by 6 PM.",
    time: "09:42",
    unread: 2,
    isOnline: true,
  },
  {
    id: "u_102",
    name: "Design Team",
    lastMessage: "Updated chat icon and empty state.",
    time: "08:16",
    unread: 0,
    isOnline: false,
  },
  {
    id: "u_103",
    name: "Rohan Verma",
    lastMessage: "Can you review the websocket reconnection flow?",
    time: "Yesterday",
    unread: 1,
    isOnline: true,
  },
  {
    id: "u_104",
    name: "Support Ops",
    lastMessage: "Alert volume dropped by 43% after patch.",
    time: "Yesterday",
    unread: 0,
    isOnline: false,
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  u_101: [
    { id: "m1", fromMe: false, text: "Morning! Are we shipping today?", time: "09:28" },
    { id: "m2", fromMe: true, text: "Yes, backend checks passed.", time: "09:31", status: "read" },
    { id: "m3", fromMe: false, text: "Great. Let's lock the release notes by 6 PM.", time: "09:42" },
  ],
  u_102: [
    { id: "m4", fromMe: false, text: "Sharing revised mobile spacing.", time: "08:04" },
    { id: "m5", fromMe: false, text: "Updated chat icon and empty state.", time: "08:16" },
  ],
  u_103: [
    { id: "m6", fromMe: false, text: "Can you review the websocket reconnection flow?", time: "Yesterday" },
  ],
  u_104: [
    { id: "m7", fromMe: false, text: "Alert volume dropped by 43% after patch.", time: "Yesterday" },
  ],
};

function App() {
  const [activeId, setActiveId] = useState<string>(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [messagesByConversation, setMessagesByConversation] =
    useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  const activeConversation = useMemo(
    () => CONVERSATIONS.find((c) => c.id === activeId) || CONVERSATIONS[0],
    [activeId]
  );

  const activeMessages = messagesByConversation[activeId] || [];

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      fromMe: true,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage],
    }));
    setDraft("");
  };

  return (
    <div className="chat-shell">
      <aside className="left-rail">
        <div className="brand">
          <div className="brand-dot" />
          <div>
            <h1>PulseChat</h1>
            <p>Real-time workspace</p>
          </div>
        </div>

        <div className="search-wrap">
          <input type="text" placeholder="Search conversations" />
        </div>

        <div className="conversation-list">
          {CONVERSATIONS.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-item ${conversation.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(conversation.id)}
            >
              <div className="avatar">{conversation.name.charAt(0)}</div>
              <div className="conversation-content">
                <div className="top-row">
                  <span className="name">{conversation.name}</span>
                  <span className="time">{conversation.time}</span>
                </div>
                <div className="bottom-row">
                  <span className="snippet">{conversation.lastMessage}</span>
                  {conversation.unread > 0 && <span className="unread">{conversation.unread}</span>}
                </div>
              </div>
              <span className={`presence ${conversation.isOnline ? "online" : "offline"}`} />
            </button>
          ))}
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div className="header-user">
            <div className="avatar large">{activeConversation.name.charAt(0)}</div>
            <div>
              <div className="title">{activeConversation.name}</div>
              <div className={`subtitle ${activeConversation.isOnline ? "online" : "offline"}`}>
                {activeConversation.isOnline ? "Online now" : "Last seen 20m ago"}
              </div>
            </div>
          </div>
          <button className="header-action">View Profile</button>
        </header>

        <section className="message-board">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`bubble-row ${msg.fromMe ? "from-me" : "from-them"}`}>
              <div className="bubble">
                <p>{msg.text}</p>
                <div className="meta">
                  <span>{msg.time}</span>
                  {msg.fromMe && <span className="status">{msg.status || "sent"}</span>}
                </div>
              </div>
            </div>
          ))}
        </section>

        <form className="composer" onSubmit={handleSend}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;
