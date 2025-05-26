'use client';

import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProposalById = async (id: string) => {
  const res = await fetch(`${API_URL}/v1/proposals/detail/${id}/client`, {});

  return res.json();
};
