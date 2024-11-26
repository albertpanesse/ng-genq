import { IApiResponse, IAuthSigningInResponsePayload, ICommonFunctionResult, IErrorResponsePayload } from "../types";
import { AUTH_URL } from '../consts';
import { HttpErrorResponse } from "@angular/common/http";

export const signingIn = async ({ input: { apiService, credential } }: any): Promise<ICommonFunctionResult<IAuthSigningInResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  return new Promise<IApiResponse>((resolve, reject) => {
    apiService.post(AUTH_URL, credential).subscribe({
      next: (result: IApiResponse) => {
        resolve(result);
      },
      error: (error: any) => {
        reject(error);
      },
    })
  })
    .then((result: IApiResponse) => {
      return {
        success: result.success,
        functionResult: result.payload,
      } as ICommonFunctionResult<IAuthSigningInResponsePayload>;
    })
    .catch((error: HttpErrorResponse) => {
      return {
        success: false,
        functionResult: error.error,
      } as ICommonFunctionResult<IErrorResponsePayload>; 
    });
};

export const signingOut = async () => {};
