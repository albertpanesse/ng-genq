import { IApiResponse, ICommonFunctionResult, IErrorResponsePayload, TFileManagerListingResponsePayload } from "../../types";
import { USER_FILE_LIST } from '../../consts';
import { HttpErrorResponse } from "@angular/common/http";

export const listing = async ({ input: { apiService } }: any): Promise<ICommonFunctionResult<TFileManagerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  return new Promise<IApiResponse>((resolve, reject) => {
    apiService.get(USER_FILE_LIST, null, null, true).subscribe({
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
      } as ICommonFunctionResult<TFileManagerListingResponsePayload>;
    })
    .catch((error: HttpErrorResponse) => {
      return {
        success: false,
        functionResult: error.error,
      } as ICommonFunctionResult<IErrorResponsePayload>; 
    });
}

export const creating = async () => {
  return { success: false };
}

export const uploading = async () => {
  return { success: false };
}

export const moving = async () => {
  return { success: false };
}

export const deleting = async () => {
  return { success: false };
}
