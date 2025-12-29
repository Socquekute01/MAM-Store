import { Outlet } from "react-router";
import ChatBubble from "@/components/chat/ChatBubble";

export default function Layout() {
  return (
    <>
      <Outlet />
      <ChatBubble />
    </>
  );
}
