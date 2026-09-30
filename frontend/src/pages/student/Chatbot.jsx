import { useEffect, useRef, useState } from "react";

import {
  Bot,
  Send,
  User,
  Sparkles,
  Trash2,
  Lightbulb,
  BriefcaseBusiness,
  BookOpen,
  Target,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import chatService from "../../services/chatService";

const initialMessage = {
  role: "assistant",
  content:
    "Hello! I'm your AI Career Assistant. I can help you with careers, skills, learning roadmaps, courses, projects, internships, and placement preparation.",
};

const suggestedQuestions = [
  {
    icon: Target,
    text: "What skills should I learn next?",
  },
  {
    icon: BriefcaseBusiness,
    text: "How can I prepare for a Full Stack Developer career?",
  },
  {
    icon: BookOpen,
    text: "Create a learning plan for me.",
  },
  {
    icon: Lightbulb,
    text: "Give me project ideas for my career.",
  },
];

function Chatbot() {
  const [messages, setMessages] = useState([
    initialMessage,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (messageText = input) => {
    const question = messageText.trim();

    if (!question || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const data =
        await chatService.sendMessage(question);

      const aiMessage =
        data?.reply ||
        data?.response ||
        data?.answer ||
        data?.message ||
        data?.data?.reply ||
        data?.data?.response ||
        "I couldn't generate a response right now.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: aiMessage,
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      const backendMessage =
        error?.response?.data?.message;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            backendMessage ||
            "Sorry, I couldn't connect to the AI Career Assistant. Please make sure your backend server and AI service are running.",
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    if (loading) {
      return;
    }

    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. How can I help you with your career?",
      },
    ]);

    setInput("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">

      {/* =========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-5 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 sm:h-12 sm:w-12">
              <Bot size={24} />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  AI Career Assistant
                </h1>

                <Sparkles
                  size={18}
                  className="hidden shrink-0 text-blue-400 sm:block"
                />

              </div>

              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Get personalized guidance for your
                career journey.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={clearChat}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-slate-700
              bg-slate-800
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-200
              transition
              hover:bg-slate-700
              sm:w-auto
            "
          >
            <Trash2 size={16} />
            Clear Chat
          </button>

        </div>

      </div>

      {/* =========================================
          CHAT CONTAINER
      ========================================== */}

      <div className="flex min-h-[calc(100vh-180px)] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a]">

        {/* =======================================
            CHAT HEADER
        ======================================== */}

        <div className="flex shrink-0 items-center gap-3 border-b border-slate-800 px-4 py-3 sm:px-5 sm:py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 sm:h-10 sm:w-10">
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-sm font-semibold text-white sm:text-base">
              Career AI
            </h2>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400" />

              <p className="text-xs text-green-400">
                Assistant available
              </p>
            </div>

          </div>

        </div>

        {/* =======================================
            MESSAGES
        ======================================== */}

        <div className="flex-1 overflow-y-auto p-3 sm:p-5">

          <div className="space-y-5">

            {/* Suggested Questions */}

            {messages.length === 1 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">

                <div className="flex items-center gap-2">

                  <Lightbulb
                    size={18}
                    className="text-yellow-400"
                  />

                  <h3 className="text-sm font-semibold text-white">
                    Try asking
                  </h3>

                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">

                  {suggestedQuestions.map(
                    (item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.text}
                          type="button"
                          onClick={() =>
                            handleSuggestedQuestion(
                              item.text
                            )
                          }
                          disabled={loading}
                          className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-slate-800
                            bg-[#0f172a]
                            p-3
                            text-left
                            text-xs
                            text-slate-300
                            transition
                            hover:border-blue-500/50
                            hover:bg-slate-900
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            sm:text-sm
                          "
                        >
                          <Icon
                            size={17}
                            className="mt-0.5 shrink-0 text-blue-400"
                          />

                          <span>
                            {item.text}
                          </span>
                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* ===================================
                MESSAGE LIST
            ==================================== */}

            {messages.map(
              (message, index) => {
                const isUser =
                  message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex gap-2 sm:gap-3 ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {/* AI Avatar */}

                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 sm:h-9 sm:w-9">
                        <Bot size={17} />
                      </div>
                    )}

                    {/* MESSAGE BUBBLE */}

                    <div
                      className={`
                        max-w-[90%]
                        rounded-2xl
                        px-3
                        py-3
                        text-sm
                        leading-6
                        sm:max-w-[80%]
                        sm:px-5
                        sm:py-4

                        ${
                          isUser
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md border border-slate-700 bg-slate-800 text-slate-100"
                        }
                      `}
                    >

                      {isUser ? (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      ) : (
                        <div
                          className="
                            ai-markdown

                            prose
                            prose-invert
                            max-w-none

                            text-sm
                            leading-7

                            prose-p:my-2
                            prose-p:text-slate-200

                            prose-headings:font-bold
                            prose-headings:text-white

                            prose-h1:mb-4
                            prose-h1:mt-1
                            prose-h1:text-xl

                            prose-h2:mb-3
                            prose-h2:mt-5
                            prose-h2:text-lg

                            prose-h3:mb-2
                            prose-h3:mt-4
                            prose-h3:text-base

                            prose-strong:font-bold
                            prose-strong:text-white

                            prose-ul:my-3
                            prose-ul:pl-5

                            prose-ol:my-3
                            prose-ol:pl-5

                            prose-li:my-1
                            prose-li:text-slate-200

                            prose-a:text-blue-400
                            prose-a:no-underline
                            hover:prose-a:underline

                            prose-code:rounded
                            prose-code:bg-slate-900
                            prose-code:px-1.5
                            prose-code:py-0.5
                            prose-code:text-blue-300

                            prose-pre:overflow-x-auto
                            prose-pre:rounded-xl
                            prose-pre:bg-slate-950

                            prose-blockquote:border-blue-500
                            prose-blockquote:text-slate-300

                            prose-hr:border-slate-700

                            prose-table:w-full
                            prose-th:border
                            prose-th:border-slate-700
                            prose-th:bg-slate-900
                            prose-th:p-2
                            prose-td:border
                            prose-td:border-slate-700
                            prose-td:p-2
                          "
                        >
                          <ReactMarkdown
                            remarkPlugins={[
                              remarkGfm,
                            ]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}

                    </div>

                    {/* USER AVATAR */}

                    {isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 sm:h-9 sm:w-9">
                        <User size={17} />
                      </div>
                    )}

                  </div>
                );
              }
            )}

            {/* ===================================
                LOADING
            ==================================== */}

            {loading && (
              <div className="flex items-start gap-2 sm:gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 sm:h-9 sm:w-9">
                  <Bot size={17} />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-slate-700 bg-slate-800 px-4 py-3">

                  <div className="flex gap-1">

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />

                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

        </div>

        {/* =======================================
            INPUT
        ======================================== */}

        <div className="shrink-0 border-t border-slate-800 bg-[#0b1220] p-3 sm:p-4">

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 sm:gap-3"
          >

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about your career..."
              rows={1}
              disabled={loading}
              className="
                min-h-[46px]
                max-h-32
                flex-1
                resize-none
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-3
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-slate-500
                focus:border-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:px-4
              "
            />

            <button
              type="submit"
              disabled={
                !input.trim() ||
                loading
              }
              aria-label="Send message"
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                transition
                hover:bg-blue-500
                disabled:cursor-not-allowed
                disabled:bg-slate-700
                disabled:text-slate-500
                sm:h-12
                sm:w-12
              "
            >
              <Send size={18} />
            </button>

          </form>

          <p className="mt-2 text-center text-[10px] text-slate-500 sm:text-xs">
            Enter to send • Shift + Enter for a new line
          </p>

        </div>

      </div>

    </div>
  );
}

export default Chatbot;