import authorizedRequest from './authorized-request';
import { Proxy } from './order.api';

export interface FindAddressResponse {
  address: string;
  nonce: string;
}
export interface SignUpResponse {
  message: string;
  data: FindAddressResponse;
  isSigned: boolean;
  nonce: string;
}
export interface LoginRequest {
  address: string;
  signature: string;
}

export interface LoginResponse {
  exp: number;
  token: string;
}

export interface EditRequest {
  name?: string;
  userName?: string;
  email?: string;
  bio?: string;
  coverImage?: string;
  avatar?: string;
  socialMediaLink?: string;
  follower?: number;
  following?: number;
}

export interface UserInfo {
  address?: string;
  avatar?: string;
  bio?: string;
  coverImage?: string;
  createdAt?: string;
  email?: string;
  follower?: number;
  following?: number;
  id?: string;
  isSigned?: string;
  name?: string;
  nonce?: string;
  role?: string;
  socialMediaLink?: string;
  updatedAt?: string;
  userName?: string;
  proxyWallet?: Proxy;
}

// export interface FormImage {
//   uri: string;
//   name: string;
//   type: string;
// }
export interface UploadRequest {
  fileType: string;
  prefix: string;
  files: Blob | null;
}
export interface UploadResponse {
  id: string;
  key: string;
  mimetype: string;
  originalName: string;
  type: string;
  prefix: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  signUp: (address: string) =>
    authorizedRequest
      .post<SignUpResponse>('/users', {
        address,
      })
      .then((res) => res.data),
  login: (body: LoginRequest) =>
    authorizedRequest
      .post<LoginResponse>('/auth', body)
      .then((res) => res.data),
  getUserInfo: () =>
    authorizedRequest.get<UserInfo>(`/users/profile`).then((res) => res.data),
  getPublicUserInfo: (address: string) =>
    authorizedRequest
      .get<UserInfo>(`/users/${address}`)
      .then((res) => res.data),
  getUserInfoPublic: (address: string) =>
    authorizedRequest
      .get<UserInfo>(`/users/${address}`)
      .then((res) => res.data),

  putUserInfo: (params: EditRequest) => {
    return authorizedRequest.patch(`/users/profile`, params);
  },

  postUploads: (params: UploadRequest) => {
    const formData = new FormData();
    formData.append('fileType', params.fileType);
    formData.append('prefix', params.prefix);
    params.files && formData.append('files', params.files);
    return authorizedRequest
      .post<UploadResponse[]>(`/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res);
  },
};
