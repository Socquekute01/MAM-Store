type Props = {
  content: string;
  sender: 'user' | 'bot' | 'admin' | 'guest';
};

function ChatMessaage({ content, sender }: Props) {
  const isUser = sender === 'user' || sender === 'guest';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[75%]
          px-4 py-2
          rounded-2xl
          text-sm
          leading-relaxed
          break-words
          whitespace-pre-wrap
          ${isUser ? 'bg-chat-primary text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'}
        `}
      >
        {content}
      </div>
    </div>
  );
}

export default ChatMessaage;
