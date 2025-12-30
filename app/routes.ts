import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // Homepage
  index("routes/index.tsx"),
  
  // Single routes
//   route("about", "routes/about.tsx"),
//   route("contact", "routes/contact.tsx"),
  
  // Admin routes với prefix
  ...prefix("admin", [
    index("routes/admin/conversations.tsx"),  // /admin
    // route("conversations", "routes/admin/conversations.tsx"), // /admin/conversations
    // route("feedback", "routes/admin/feedback.tsx"), // /admin/feedback
    // route("profile", "routes/admin/profile.tsx"), // /admin/profile
  ]),
  
  // Routes với dynamic params
//   route("chat/:conversationId", "routes/chat.$conversationId.tsx"),
  
//   // Nested routes với layout
//   layout("routes/layouts/admin-layout.tsx", [
//     route("admin/users", "routes/admin/users.tsx"),
//     route("admin/settings", "routes/admin/settings.tsx"),
//   ]),
  
  // Catch-all 404
//   route("*", "routes/404.tsx"),
] satisfies RouteConfig;