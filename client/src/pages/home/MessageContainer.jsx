import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessageThunk,
  sendMessageThunk,
} from "../../store/slice/message/message.thunk";
import { setSelectedUser } from "../../store/slice/user/user.slice";
import SendMessage from "./SendMessage";
import {
  IoArrowBack,
  IoCallOutline,
  IoVideocamOutline,
  IoShieldCheckmarkOutline,
  IoChevronDown,
} from "react-icons/io5";
import { HiChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";

const ICE_BREAKERS = [
  "Hey! How's it going? 👋",
  "Hi! Long time no talk 😊",
  "What are you up to today? 🚀",
  "Hey, got a quick minute to chat? 💬",
];

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser, userProfile } = useSelector((state) => state.userReducer);
  const { onlineUsers, typingUsers } = useSelector((state) => state.socketReducer);
  const { messages, screenLoading } = useSelector(
    (state) => state.messageReducer
  );

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const isUserOnline =
    Array.isArray(onlineUsers) &&
    onlineUsers.some((id) => String(id) === String(selectedUser?._id));
  const isTyping =
    Array.isArray(typingUsers) &&
    typingUsers.some((id) => String(id) === String(selectedUser?._id));

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessageThunk({ recieverId: selectedUser._id }));
    }
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > 180) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendIceBreaker = async (text) => {
    if (!selectedUser?._id) return;
    await dispatch(
      sendMessageThunk({
        recieverId: selectedUser._id,
        message: text,
      })
    );
  };

  return (
    <div className="h-full flex-1 flex flex-col bg-base-100 overflow-hidden relative">
      {!selectedUser ? (
        /* Welcome Screen */
        <div className="h-full w-full flex items-center justify-center p-6 flex-col">
          <div className="max-w-md w-full text-center space-y-6 animate-fadeIn">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-content mx-auto shadow-2xl shadow-primary/25">
                <HiChatBubbleLeftRight size={48} />
              </div>
              <span className="absolute -bottom-1 -right-1 p-2 rounded-full bg-base-100 shadow-md">
                <HiSparkles className="text-warning text-lg animate-spin" style={{ animationDuration: "6s" }} />
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent brand-font">
                Welcome to BhatChat, {userProfile?.fullName?.split(" ")[0] || "Friend"}!
              </h2>
              <p className="text-sm text-base-content/60 mt-2 max-w-sm mx-auto">
                Select a conversation from the sidebar or search for a friend to begin your real-time chat experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-white/5 text-left space-y-1">
                <div className="text-primary text-lg">⚡</div>
                <h4 className="text-xs font-bold">Real-Time Messaging</h4>
                <p className="text-[11px] text-base-content/50">
                  Instant delivery with live status & typing alerts
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-base-200/50 border border-white/5 text-left space-y-1">
                <div className="text-emerald-400 text-lg">🔒</div>
                <h4 className="text-xs font-bold">Secure Credentials</h4>
                <p className="text-[11px] text-base-content/50">
                  Update your username, password & custom avatar anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Chat View */
        <>
          {/* Header */}
          <div className="px-4 py-3 border-b border-base-300 bg-base-100/80 backdrop-blur-md flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center gap-3">
              {/* Back button for mobile */}
              <button
                onClick={() => dispatch(setSelectedUser(null))}
                className="btn btn-ghost btn-circle btn-sm md:hidden text-base-content/70 hover:text-base-content"
                title="Back to contacts"
              >
                <IoArrowBack size={20} />
              </button>

              <div className="relative">
                <div className="w-11 h-11 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100 overflow-hidden shadow-sm bg-base-300">
                  <img
                    src={
                      selectedUser?.avatar ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt={selectedUser?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isUserOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100 online-pulse" />
                )}
              </div>

              <div>
                <h2 className="font-bold text-sm tracking-tight flex items-center gap-2">
                  <span>{selectedUser?.fullName}</span>
                </h2>
                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                      <span>typing</span>
                      <span className="flex gap-0.5">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    </span>
                  ) : isUserOnline ? (
                    <span className="text-xs text-emerald-400 font-medium">
                      Active Now
                    </span>
                  ) : (
                    <span className="text-xs text-base-content/50">
                      @{selectedUser?.username}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 text-base-content/70">
              <button
                onClick={() => toast("Voice calls coming soon in BhatChat Pro! 🎙️")}
                className="btn btn-ghost btn-circle btn-sm hover:text-primary transition-colors"
                title="Start Voice Call"
              >
                <IoCallOutline size={18} />
              </button>
              <button
                onClick={() => toast("Video calls coming soon in BhatChat Pro! 📹")}
                className="btn btn-ghost btn-circle btn-sm hover:text-primary transition-colors"
                title="Start Video Call"
              >
                <IoVideocamOutline size={19} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.015) 0%, transparent 100%)`,
            }}
          >
            {/* Encryption notice */}
            <div className="flex justify-center my-2">
              <div className="px-3 py-1 rounded-full bg-base-200/60 border border-white/5 text-[11px] text-base-content/50 flex items-center gap-1.5 shadow-sm">
                <IoShieldCheckmarkOutline className="text-emerald-400" />
                <span>Messages in BhatChat are real-time & private</span>
              </div>
            </div>

            {screenLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <span className="loading loading-spinner loading-md text-primary"></span>
                  <p className="text-xs text-base-content/50">Loading conversation...</p>
                </div>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((messageDetails) => (
                <Message
                  key={messageDetails?._id || Math.random()}
                  messageDetails={messageDetails}
                />
              ))
            ) : (
              /* Empty Conversation / Ice Breakers */
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-inner">
                  👋
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    Say Hello to {selectedUser?.fullName}!
                  </h3>
                  <p className="text-xs text-base-content/60 mt-1 max-w-xs mx-auto">
                    No messages here yet. Break the ice with a friendly greeting below:
                  </p>
                </div>

                {/* Icebreaker chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-sm pt-2">
                  {ICE_BREAKERS.map((text, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendIceBreaker(text)}
                      className="btn btn-xs rounded-full bg-base-200 hover:bg-primary/20 hover:text-primary hover:border-primary/40 border border-white/10 transition-all text-xs font-normal"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-6 btn btn-circle btn-sm btn-primary shadow-lg animate-bounce"
              title="Scroll to latest messages"
            >
              <IoChevronDown size={18} />
            </button>
          )}

          {/* Send Input Bar */}
          <SendMessage />
        </>
      )}
    </div>
  );
};

export default MessageContainer;
