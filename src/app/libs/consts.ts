import { ENV } from '../config';

export const API_URL = `${ENV.API_URL}`;

export const AUTH_URL = `${API_URL}/auth/signin`;
export const REFRESH_TOKEN_URL = `${API_URL}/auth/refresh`;

export const USER_FILE_LIST = `${API_URL}/user-file/list`;
export const USER_FILE_CREATE = `${API_URL}/user-file/create-dir`;
export const USER_FILE_PREVIEW = `${API_URL}/user-file/preview`;
