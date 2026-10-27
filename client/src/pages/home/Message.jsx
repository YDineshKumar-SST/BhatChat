import { useState } from "react";
import { useSelector } from "react-redux";
import { IoCheckmarkDoneOutline, IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const QUICK_REACTIONS = ["❤️", "👍", "😂", "🔥", "😮"];

const Message = ({ messageDetails }) => {
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );
  const [reactions, setReactions] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);

  const isFromMe = userProfile?._id === messageDetails?.senderId;
  const formattedTime = messageDetails?.createdAt
    ? new Date(messageDetails.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCopy = () => {
    if (messageDetails?.message) {
      navigator.clipboard.writeText(messageDetails.message);
      toast.success("Message copied to clipboard!");
    }
  };

  const handleAddReaction = (emoji) => {
    if (reactions.includes(emoji)) {
      setReactions(reactions.filter((r) => r !== emoji));
    } else {
      setReactions([...reactions, emoji]);
    }
  };

  return (
    <div
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
      className={`group relative flex items-end gap-2.5 animate-message-in ${
        isFromMe ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm bg-base-300 ring-1 ring-white/10 mb-1">
        <img
          alt="Avatar"
          src={
            isFromMe
              ? userProfile?.avatar ||
                "https://avatar.iran.liara.run/public/boy"
              : selectedUser?.avatar ||
                "https://avatar.iran.liara.run/public/boy"
          }
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bubble + Actions Container */}
      <div
        className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
          isFromMe ? "items-end" : "items-start"
        }`}
      >
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2.5 text-sm break-words transition-all ${
            isFromMe
              ? "bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl rounded-br-sm shadow-md shadow-primary/10"
              : "bg-base-200/90 text-base-content border border-white/5 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">
            {messageDetails?.message}
          </p>

          {/* Timestamp & Sent Status */}
          <div
            className={`flex items-center gap-1 mt-1 text-[10px] select-none ${
              isFromMe ? "justify-end text-primary-content/80" : "justify-start opacity-50"
            }`}
          >
            <span>{formattedTime}</span>
            {isFromMe && (
              <IoCheckmarkDoneOutline size={13} className="text-primary-content" />
            )}
          </div>
        </div>

        {/* Reactions Display */}
        {reactions.length > 0 && (
          <div
            className={`flex gap-1 mt-1 ${
              isFromMe ? "justify-end" : "justify-start"
            }`}
          >
            {reactions.map((r, i) => (
              <span
                key={i}
                onClick={() => handleAddReaction(r)}
                className="px-1.5 py-0.5 rounded-full bg-base-200 border border-white/10 text-xs cursor-pointer shadow-sm hover:scale-110 transition-transform"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover Action Toolbar */}
      {showToolbar && (
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-base-200/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/10 mb-2 ${
            isFromMe ? "order-first" : "order-last"
          }`}
        >
          {/* Reaction Buttons */}
          <div className="flex items-center gap-0.5">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddReaction(emoji)}
                className="hover:scale-125 transition-transform text-xs p-1"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-3 bg-white/20 mx-1" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:text-primary transition-colors text-xs text-base-content/70"
            title="Copy Message"
          >
            <IoCopyOutline size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;
