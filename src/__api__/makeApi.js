import Swal from "sweetalert2";

const getBaseMakeUrl = () => {
  const companyName = sessionStorage.getItem("companyName");
  console.log("companyName", companyName);
  if (companyName === "AIS") {
    return "https://hook.eu2.make.com/alpp34ehnustwnfpjwbjq9nvopukbuz0";
  }
  return (
    import.meta.env.BASE_MAKE_URL || "https://hook.eu2.make.com/jtrmhe5sycxd1ni2oy90iuielb17fzh1"
  );
};

const COMMON_HEADERS_JSON = {
  "Content-Type": "application/json"
};

const MakeApi = {
  async insertAgent(data) {
    try {
      const response = await fetch(`${getBaseMakeUrl()}?method=insert`, {
        method: "POST",
        headers: COMMON_HEADERS_JSON,
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Failed to insert agent");

      Swal.fire("Success", "Agent added successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  },

  async deleteAgent(key) {
    try {
      const response = await fetch(`${getBaseMakeUrl()}?key=${key}&method=delete`, {
        method: "DELETE",
        headers: COMMON_HEADERS_JSON
      });

      if (!response.ok) throw new Error("Failed to delete agent");
      Swal.fire("Deleted", "Agent deleted successfully", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      throw error;
    }
  },

  async getAgentByKey(key) {
    try {
      const response = await fetch(`${getBaseMakeUrl()}?key=${key}&method=one`, {
        headers: COMMON_HEADERS_JSON
      });

      if (!response.ok) throw new Error("Failed to fetch agent");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async getAgentName(key) {
    try {
      const response = await fetch(`${getBaseMakeUrl()}?key=${key}&method=agentName`, {
        headers: COMMON_HEADERS_JSON
      });

      if (!response.ok) throw new Error("Failed to fetch agent name");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async getAllAgents({ searchString = "", page = 1, limit = 20 } = {}) {
    try {
      console.log("url:", getBaseMakeUrl());
      const url = new URL(getBaseMakeUrl());
      url.searchParams.append("searchString", searchString);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);
      url.searchParams.append("method", "all");

      const response = await fetch(url.toString(), {
        headers: COMMON_HEADERS_JSON
      });

      if (!response.ok) throw new Error("Failed to fetch agents");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default MakeApi;
