export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  profile: `${API_BASE_URL}/api/auth/profile`,
  chats: `${API_BASE_URL}/api/chat/chat`,
  messages: (chatId) => `${API_BASE_URL}/api/message/messages/${chatId}`,
  companionSpark: `${API_BASE_URL}/api/integrations/companion-spark`,
};
