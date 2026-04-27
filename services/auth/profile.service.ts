import { apiMutation, apiRequest } from "@/lib/client/api";
import type { AuthProfile, UpdateProfileValues } from "@/types/api/auth";

export const getProfile = async (): Promise<AuthProfile> => apiRequest<AuthProfile>("/api/auth/profile");

export const updateProfile = async (values: UpdateProfileValues): Promise<AuthProfile> =>
  apiMutation<AuthProfile, UpdateProfileValues>("/api/auth/profile", "PATCH", values);
