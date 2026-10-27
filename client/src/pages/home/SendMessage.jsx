import { useState, useRef, useEffect } from "react";
import { IoSend, IoHappyOutline, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../store/slice/message/message.thunk";
import { getSocket } from "../../socket/socketClient";

const POPULAR_EMOJIS = [
  "😀", "😂", "🥰", "😍", "😎", "🥳",
  "🤔", "🙌", "🔥", "✨", "💯", "🎉",
  "👍", "❤️", "🚀", "💬", "👋", "🙏",
  "👀", "👏", "⚡", "🥺", "😇", "💪"
];

const SendMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { buttonLoading } = useSelector((state) => state.messageReducer);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const emitTyping = () => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    socket.emit("typing", { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    emitTyping();
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    inputRef.current?.focus();
    emitTyping();
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !selectedUser?._id || buttonLoading) return;

    // Stop typing notification immediately
    const socket = getSocket();
    if (socket && selectedUser?._id) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessage("");
    setShowEmojiPicker(false);

    await dispatch(
      sendMessageThunk({
        recieverId: selectedUser._id,
        message: trimmed,
      })
    );
  };

  return (
    <div className="relative p-3 md:p-4 border-t border-base-300 bg-base-100/90 backdrop-blur-md">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 left-4 z-30 p-3 rounded-2xl bg-base-200/95 backdrop-blur-xl border border-white/10 shadow-2xl w-64 animate-message-in"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
            <span className="text-xs font-semibold opacity-70">
              Quick Emojis
            </span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-base-content/50 hover:text-base-content text-xs"
            >
              <IoClose size={14} />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1 text-lg">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-base-300/60 flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 max-w-5xl mx-auto"
      >
        <div className="flex-1 relative flex items-center">
          {/* Emoji Toggle Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 text-base-content/50 hover:text-primary transition-colors"
            title="Add Emoji"
          >
            <IoHappyOutline size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder={`Message ${selectedUser?.fullName || "friend"}...`}
            className="input input-bordered w-full pl-10 pr-4 bg-base-200/50 rounded-2xl focus:input-primary transition-all text-sm"
            value={message}
            onChange={handleInputChange}
            disabled={!selectedUser}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || buttonLoading || !selectedUser}
          className={`btn btn-circle btn-primary shadow-lg shadow-primary/20 transition-transform active:scale-95 ${
            !message.trim() ? "btn-disabled opacity-40" : ""
          }`}
          title="Send message (Enter)"
        >
          {buttonLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <IoSend size={16} className="ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
