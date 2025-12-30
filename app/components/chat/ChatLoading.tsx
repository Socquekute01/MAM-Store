export function ChatLoading() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      ))}
    </>
  );
}
