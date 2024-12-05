import { ENV } from '../config';

export const API_URL = `${ENV.API_URL}`;

export const AUTH_URL = `${API_URL}/auth/signin`;
export const REFRESH_TOKEN_URL = `${API_URL}/auth/refresh`;

export const USER_FILE_LIST = `${API_URL}/user-file`;
