// src/__api__/categoryApi.js
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const COMMON_HEADERS_JSON = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "1"
};

const CategoryApi = {
  async fetchCategories({ filter = "", pageToken = "", pageSize = 5 } = {}) {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (pageToken) params.append("pageToken", pageToken);
    if (pageSize) params.append("pageSize", pageSize);
    console.log("route", `${BASE_URL}/category?${params.toString()}`);

    const response = await fetch(`${BASE_URL}/category?${params.toString()}`, {
      headers: { "ngrok-skip-browser-warning": "1" }
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  },

  async addCategory(name) {
    const response = await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error("Failed to add category");
    Swal.fire("Success", "Category added successfully", "success");
  },

  async updateCategory(id, name) {
    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "PUT",
      headers: COMMON_HEADERS_JSON,
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error("Failed to update category");
    Swal.fire("Success", "Category updated successfully", "success");
  },

  async deleteCategory(id) {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}`, {
        method: "DELETE",
        headers: { "ngrok-skip-browser-warning": "1" }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category.");
      }

      Swal.fire("Deleted", "Category deleted successfully", "success");
      return "success";
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      return "error";
    }
  }
};

export default CategoryApi;
