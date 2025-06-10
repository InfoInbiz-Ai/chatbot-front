// src/__api__/categoryApi.js
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CategoryApi = {
  async fetchCategories({ filter = "", pageToken = "", pageSize = 5 } = {}) {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);
    if (pageToken) params.append("pageToken", pageToken);
    if (pageSize) params.append("pageSize", pageSize);
  
    const response = await fetch(`${BASE_URL}/category?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  },  

  async addCategory(name) {
    const response = await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to add category");
    Swal.fire("Success", "Category added successfully", "success");
  },

  async updateCategory(id, name) {
    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to update category");
    Swal.fire("Success", "Category updated successfully", "success");
  },

  async deleteCategory(id) {
    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete category");
    Swal.fire("Deleted", "Category deleted successfully", "success");
  },
};

export default CategoryApi;
