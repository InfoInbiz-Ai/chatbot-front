// src/__api__/documentApi.js
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const COMMON_HEADERS_JSON = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "1"
};

const DocumentApi = {
  async fetchDocuments({ kbId, pageSize = 10, pageToken = null }) {
    const params = new URLSearchParams();
    params.append("kbId", kbId);
    params.append("pageSize", pageSize);
    if (pageToken) params.append("pageToken", pageToken);

    const response = await fetch(`${BASE_URL}/documents?${params}`, {
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    console.log("response", response);
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Failed to fetch documents");
    return json.data;
  },

  async addDocument({ kbId, displayName, ...rest }) {
    const payload = { ...rest, kbId, displayName };
    console.log("document payload", payload);

    const response = await fetch(`${BASE_URL}/documents`, {
      method: "POST",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Failed to add document");

    Swal.fire("Success", "Document added successfully", "success");
  },

  async getSingleKB(kbId, documentId) {
    const response = await fetch(`${BASE_URL}/documents/${kbId}/${documentId}`, {
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || "Failed to fetch Knowledge Base");
    }

    return json.data;
  },

  async updateDocument(kbId, documentId, updatedDocument) {
    const response = await fetch(`${BASE_URL}/documents/${kbId}/${documentId}`, {
      method: "PUT",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify(updatedDocument)
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Failed to update document");
    Swal.fire("Success", "Document updated successfully", "success");
  },

  async deleteDocument(kbId, documentId) {
    const response = await fetch(`${BASE_URL}/documents/${kbId}/${documentId}`, {
      method: "DELETE",
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Failed to delete document");
    Swal.fire("Deleted", "Document deleted successfully", "success");
  }
};

export default DocumentApi;
