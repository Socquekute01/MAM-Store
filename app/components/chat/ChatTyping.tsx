export default function ChatTyping() {
  return (
    <div className="flex w-fit gap-1 rounded-chat bg-slate-100 px-3 py-2">
      <span className="typing-dot" />
      <span className="typing-dot delay-150" />
      <span className="typing-dot delay-300" />
    </div>
  );
}
