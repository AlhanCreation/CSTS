export const API = "http://localhost:5209/api";

// Generic API Fetch Helper
export async function apiFetch(endpoint, method = 'GET', body = null, auth = false, isForm = false) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';

  // ✅ Attach Bearer Token if required
  if (auth) {
    const token = localStorage.getItem('token');
    console.log("🔑 Token in storage:", token);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${API}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    console.log("🌐 Fetching:", url);

    const res = await fetch(url, {
      method,
      headers,
      body: body && !isForm ? JSON.stringify(body) : body,
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      let errMsg = "API Error";
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        errMsg = errData.message || errMsg;
      } else {
        errMsg = await res.text();
      }
      throw new Error(errMsg);
    }

    if (res.status === 204 || !contentType || !contentType.includes("application/json"))
      return;

    return await res.json();
  } catch (err) {
    console.error("🚨 Fetch failed:", err);
    return null;
  }
}

// ✅ AUTH
export const register = (data) => apiFetch('/auth/register', 'POST', data);
export const login = (data) => apiFetch('/auth/login', 'POST', data);

// ✅ USERS
export const getAllAgents = () => apiFetch('/users/agents', 'GET', null, true);
export const logoutUser = () => apiFetch('/users/logout', 'POST', null, true);

// ✅ TICKETS
export const createTicket = (data) => apiFetch('/tickets', 'POST', data, true);
export const getAllTickets = () => apiFetch('/tickets', 'GET', null, true);
export const getTicketById = (id) => apiFetch(`/tickets/${id}`, 'GET', null, true);
export const assignTicket = (data) => apiFetch('/tickets/assign', 'PUT', data, true);
export const updateTicketStatus = (id, status) =>
  apiFetch(`/tickets/${id}/status`, 'PUT', { status }, true);
export const deleteTicket = (id) =>
  apiFetch(`/tickets/${id}`, 'DELETE', null, true);

// ✅ COMMENTS
export const addComment = (ticketId, data) =>
  apiFetch(`/comments`, 'POST', data, true);
export const getComments = (ticketId) =>
  apiFetch(`/comments/${ticketId}`, 'GET', null, true);

// ✅ EXTRA (Admin & Agent Tools)
export const getUnassignedTickets = () =>
  apiFetch('/tickets', 'GET', null, true).then((data) =>
    data ? data.filter((t) => !t.assignedTo) : []
  );

export const getTicketsByAgent = (agentId) =>
  apiFetch('/tickets', 'GET', null, true).then((data) =>
    data ? data.filter((t) => t.assignedTo === agentId) : []
  );
