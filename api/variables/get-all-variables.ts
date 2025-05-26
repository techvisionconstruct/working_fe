'use client';

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get('auth-token');

export const getAllVariables = async (page = 1, pageSize = 10, searchQuery?: string) => {
  const TOKEN = getAuthToken();
  
  let url = `${API_URL}/v1/variables/list/?page=${page}&page_size=${pageSize}`;
  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};