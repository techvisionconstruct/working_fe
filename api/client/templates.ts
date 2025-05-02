import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get('auth-token');

export const getTemplates = async (page = 1, pageSize = 10, searchQuery?: string) => {
  const token = getAuthToken();
  
  let url = `${API_URL}/v1/templates/list/?page=${page}&page_size=${pageSize}`;
  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

export const getTemplateById = async (id: string) => {
  const token = getAuthToken();
  
  const res = await fetch(`${API_URL}/v1/templates/detail/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}