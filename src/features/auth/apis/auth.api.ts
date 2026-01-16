import { URL } from "@/shared/constants/urls";
import http from "@/shared/utils/http";
import { AxiosResponse } from "axios";
import {
  LoginApiResponse,
  LoginPayload,
  MeApiResponse,
} from "../types/auth.type";

export const authApi = {
  loginAccount(body: LoginPayload): Promise<AxiosResponse<LoginApiResponse>> {
    return http.post<LoginApiResponse>(URL.LOGIN, body);
  },

  logout(): Promise<AxiosResponse<{ code: number; message: string }>> {
    return http.post<{ code: number; message: string }>(URL.LOGOUT);
  },

  getMe(): Promise<AxiosResponse<MeApiResponse>> {
    return http.get<MeApiResponse>(URL.ME);
  },
};
