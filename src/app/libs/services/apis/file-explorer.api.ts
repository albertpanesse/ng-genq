import { IApiResponse, ICommonFunctionResult, IErrorResponsePayload, TFileExplorerListingResponsePayload, TFileExplorerPreviewingResponsePayload } from "../../types";
import { USER_FILE_LIST, USER_FILE_PREVIEW } from '../../consts';
import { ApiService } from "../api.service";
import { IFileExplorerActionPreviewParams } from "src/app/components/file-explorer/libs";

export const listing = async ({ input: { apiService } }: any): Promise<ICommonFunctionResult<TFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.get(USER_FILE_LIST, null, {}, true);
    return {
      success: result.success,
      functionResult: result.payload,
    } as ICommonFunctionResult<TFileExplorerListingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }
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

export const previewing = async ({ input: { apiService, params } }: any): Promise<ICommonFunctionResult<TFileExplorerPreviewingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_PREVIEW, params, {}, true);
    return {
      success: result.success,
      functionResult: result.payload,
    } as ICommonFunctionResult<TFileExplorerPreviewingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }

}
