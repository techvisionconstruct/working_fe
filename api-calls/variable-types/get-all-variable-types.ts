'use client';

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get('auth-token');

export const getAllVariableTypes = async () => {
  const res = await fetch(`${API_URL}/v1/variable-types/list/`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  });
  return res.json();
};