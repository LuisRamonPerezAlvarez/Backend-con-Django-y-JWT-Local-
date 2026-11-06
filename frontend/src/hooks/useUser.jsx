import { getMeApi } from "../api/user";

export function useUser() {
  const getMe = async (token) => {
    try {
      const result = await getMeApi(token);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return { getMe };
}

