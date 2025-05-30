interface OnboardingData {
  user_industry: { name: string }[];
  user_problems: { name: string }[];
  user_goals: { name: string }[];
  email: string;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createOnboardingRequest = async (
  data: OnboardingData
): Promise<OnboardingResponse> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
  try {
    const response = await fetch(`${API_URL}/v1/onboarding/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: "Onboarding completed successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error creating onboarding:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
