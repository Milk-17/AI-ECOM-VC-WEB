import axios from "axios";

// https://ai-ecom-vc-api.vercel.app/api/admin/orders

export const getOrdersAdmin = async (token) => {
  return axios.get("https://ai-ecom-vc-api.vercel.app/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeOrderStatus = async (token, orderId, orderStatus , trackingNumber) => {
  return axios.put(
    "https://ai-ecom-vc-api.vercel.app/api/admin/order-status",
    {
      orderId,
      orderStatus,
      trackingNumber,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getListAllUsers = async (token) => {
  return axios.get("https://ai-ecom-vc-api.vercel.app/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserStatus = async (token, value) => {
  return axios.post("https://ai-ecom-vc-api.vercel.app/api/change-status", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserRole = async (token, value) => {
  return axios.post("https://ai-ecom-vc-api.vercel.app/api/change-role", value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getOrderAdminStats = async (token) => {
  return await axios.get("https://ai-ecom-vc-api.vercel.app/api/admin/order-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAdminLogs = async (token) => {
  return await axios.get("https://ai-ecom-vc-api.vercel.app/api/admin/logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTrackingNumber = async (token, orderId, trackingNumber) => {
  return await axios.put(
    `https://ai-ecom-vc-api.vercel.app/api/order/tracking/${orderId}`,
    { trackingNumber },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};