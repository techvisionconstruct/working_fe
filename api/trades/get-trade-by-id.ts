'use client';

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthToken = () => Cookies.get("auth-token");

export const getTradeById = async (id: string) => {
    const TOKEN = getAuthToken();
    const res = await fetch(`${API_URL}/v1/trades/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return res.json();
  };