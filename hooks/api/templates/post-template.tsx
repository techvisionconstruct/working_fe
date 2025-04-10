import { Template } from '@/types/templates';
import Cookie from "js-cookie";

export async function postTemplate(template: Template): Promise<Template>{
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookie.get('auth-token');
  const requestBody = new FormData();
  requestBody.append('title', template.title);
  if (template.image) {
    requestBody.append('imageUrl', template.imageUrl);
  }
  console.log(requestBody)
  
  console.log(template.image)
  const response = await fetch(`${apiUrl}/api/templates/templates/new/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: requestBody,
  });

  if(!response.ok){
    throw new Error('Failed to create template');
  }

  return response.json();
}