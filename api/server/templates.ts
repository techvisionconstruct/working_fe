import { Template } from '@/components/features/create-template-page/types';
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.get("auth-token");

export async function postTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const formData = new FormData();
    Object.entries(template).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await fetch(`${API_URL}/api/templates/templates/new/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create template')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

