import { URL } from "@/shared/constants/urls";
import http from "@/shared/utils/http";
import { AxiosResponse } from "axios";
import {
  ChangePasswordApiResponse,
  ChangePasswordPayload,
  MeApiResponse,
} from "../types/user.type";

export const userApi = {
  getMe(): Promise<AxiosResponse<MeApiResponse>> {
    return http.get<MeApiResponse>(URL.USER_ME);
  },

  changePassword(
    body: ChangePasswordPayload
  ): Promise<AxiosResponse<ChangePasswordApiResponse>> {
    return http.put<ChangePasswordApiResponse>(URL.CHANGE_PASSWORD, body);
  },
};
