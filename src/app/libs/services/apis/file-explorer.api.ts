import camelcaseKeys from "camelcase-keys";
import { IApiResponse, ICommonFunctionResult, IErrorResponsePayload, IFileExplorerCreatingResponsePayload, IFileExplorerListingResponsePayload, IFileExplorerPreviewingResponsePayload } from "../../types";
import { USER_FILE_CREATE, USER_FILE_LIST, USER_FILE_PREVIEW } from '../../consts';
import { ICreateDirDTO } from "../../dtos";
import { ApiService } from "../api.service";

export const listing = async ({ input: { apiService, userFileId } }: any): Promise<ICommonFunctionResult<IFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.get(`${USER_FILE_LIST}/${userFileId}`, null, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true}) as IFileExplorerListingResponsePayload,
    } as ICommonFunctionResult<IFileExplorerListingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>;
  }
}

export const creating = async ({ input: { apiService, createDirDTO } }: { input: { apiService: ApiService; createDirDTO: ICreateDirDTO } }): Promise<ICommonFunctionResult<IFileExplorerCreatingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_CREATE, createDirDTO, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true}) as IFileExplorerCreatingResponsePayload,
    } as ICommonFunctionResult<IFileExplorerCreatingResponsePayload>;
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

export const previewing = async ({ input: { apiService, params } }: any): Promise<ICommonFunctionResult<IFileExplorerPreviewingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_PREVIEW, params, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IFileExplorerPreviewingResponsePayload,
    } as ICommonFunctionResult<IFileExplorerPreviewingResponsePayload>;
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>;
  }

}
