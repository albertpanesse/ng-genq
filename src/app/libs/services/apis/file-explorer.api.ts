import camelcaseKeys from "camelcase-keys";
import {
  IApiResponse,
  ICommonFunctionResult,
  IErrorResponsePayload,
  IFileExplorerCreatingResponsePayload,
  IFileExplorerListingResponsePayload,
  IFileExplorerPreviewingResponsePayload
} from "../../types";
import { USER_FILE_CREATE, USER_FILE_LIST, USER_FILE_PREVIEW } from '../../consts';
import { ICreateDirDTO, IFileDirListDTO } from "../../dtos";
import { ApiService } from "../api.service";
import { HttpParams } from "@angular/common/http";

export const listing = async (
  { input: { apiService, fileDirListDTO } }:
  { input: { apiService: ApiService; fileDirListDTO: IFileDirListDTO } }
): Promise<ICommonFunctionResult<IFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.get(
      `${USER_FILE_LIST}/${fileDirListDTO.userFileId}`,
      {} as HttpParams,
      {},
      true
    );
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IFileExplorerListingResponsePayload,
    };
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error ?? { message: 'Unknown error' }, // 👈 safer fallback
    };
  }
};

export const creating = async (
  { input: { apiService, createDirDTO } }:
  { input: { apiService: ApiService; createDirDTO: ICreateDirDTO } }
): Promise<ICommonFunctionResult<IFileExplorerCreatingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_CREATE, createDirDTO, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IFileExplorerCreatingResponsePayload,
    };
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error ?? { message: 'Unknown error' },
    };
  }
};

export const uploading = async () => ({ success: false });
export const moving = async () => ({ success: false });
export const deleting = async () => ({ success: false });

export const previewing = async (
  { input: { apiService, params } }:
  { input: { apiService: ApiService; params: { userFileId: number; numberOfLine: number } } }
): Promise<ICommonFunctionResult<IFileExplorerPreviewingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_PREVIEW, params, {}, true);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IFileExplorerPreviewingResponsePayload,
    };
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error ?? { message: 'Unknown error' },
    };
  }
};
