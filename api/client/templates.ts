import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getTemplates = async () => {
  const res = await fetch(`${API_URL}/api/templates/templates`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};

export const getTemplateById = async (id: number) => {
  const res = await fetch(`${API_URL}/api/templates/templates/${id}`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
}