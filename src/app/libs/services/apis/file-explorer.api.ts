import camelcaseKeys from "camelcase-keys";
import { IApiResponse, ICommonFunctionResult, IErrorResponsePayload, TFileExplorerListingResponsePayload, TFileExplorerPreviewingResponsePayload } from "../../types";
import { USER_FILE_CREATE, USER_FILE_LIST, USER_FILE_PREVIEW } from '../../consts';
import { IAuthDTO, ICreateDirDTO } from "../../dtos";
import { ApiService } from "../api.service";

export const listing = async ({ input: { apiService } }: any): Promise<ICommonFunctionResult<TFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.get(USER_FILE_LIST, null, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true}) as TFileExplorerListingResponsePayload,
    } as ICommonFunctionResult<TFileExplorerListingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }
}

export const creating = async ({ input: { apiService, createDirDTO } }: { input: { apiService: ApiService; createDirDTO: ICreateDirDTO } }): Promise<ICommonFunctionResult<TFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_CREATE, createDirDTO, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true}) as TFileExplorerListingResponsePayload,
    } as ICommonFunctionResult<TFileExplorerListingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }
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
      functionResult: camelcaseKeys(result.payload, { deep: true }) as TFileExplorerPreviewingResponsePayload,
    } as ICommonFunctionResult<TFileExplorerPreviewingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }

}
