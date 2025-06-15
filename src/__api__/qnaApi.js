// src/__api__/qnaApi.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const COMMON_HEADERS_JSON = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "1"
};

const QnAApi = {
  async fetchAll() {
    const res = await fetch(`${BASE_URL}/qna`, {
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    if (!res.ok) throw new Error("Failed to fetch Q&A");
    return await res.json();
  },
  async add(item) {
    const res = await fetch(`${BASE_URL}/qna`, {
      method: "POST",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error("Failed to add Q&A");
    return await res.json();
  },
  async update(id, item) {
    const res = await fetch(`${BASE_URL}/qna/${id}`, {
      method: "PUT",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error("Failed to update Q&A");
    return await res.json();
  },
  async delete(id) {
    const res = await fetch(`${BASE_URL}/qna/${id}`, {
      method: "DELETE",
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    if (!res.ok) throw new Error("Failed to delete Q&A");
    return await res.json();
  }
};

export default QnAApi;
