import api from "./api";

const chatService = {
  /**
   * Send a message to the AI Career Assistant.
   *
   * Backend endpoint:
   * POST /api/ai/chat
   *
   * Request:
   * {
   *   message: "What skills should I learn?"
   * }
   */
  async sendMessage(message) {
    if (!message || !message.trim()) {
      throw new Error("Message cannot be empty.");
    }

    const response = await api.post("/ai/chat", {
      message: message.trim(),
    });

    return response.data;
  },
};

export default chatService;