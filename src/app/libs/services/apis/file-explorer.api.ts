import camelcaseKeys from "camelcase-keys";
import {
  IApiResponse,
  ICommonFunctionResult,
  IErrorResponsePayload,
  IFileExplorerCreatingResponsePayload,
  IFileExplorerListingResponsePayload,
  IFileExplorerPreviewingResponsePayload,
  IFileExplorerUploadingResponsePayload
} from "../../types";
import { USER_FILE_CREATE, USER_FILE_LIST, USER_FILE_PREVIEW, USER_FILE_UPLOAD } from '../../consts';
import { ICreateDirDTO, IFileDirListDTO, IPreviewFileDTO, IUploadFileDTO } from "../../dtos";
import { ApiService } from "../api.service";
import { HttpParams } from "@angular/common/http";

export const listing = async (
  { input: { apiService, fileDirListDTO } }:
  { input: { apiService: ApiService; fileDirListDTO: IFileDirListDTO } }
): Promise<ICommonFunctionResult<IFileExplorerListingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.get(
      `${USER_FILE_LIST}/${fileDirListDTO.user_file_id}`,
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

export const uploading = async (
  { input: { apiService, uploadFileDTO } }:
  { input: { apiService: ApiService; uploadFileDTO: IUploadFileDTO } }
): Promise<ICommonFunctionResult<IFileExplorerUploadingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(
      `${USER_FILE_UPLOAD}`,
      {
        file: uploadFileDTO.file,
        parent_id: uploadFileDTO.parent_id
      },
      {},
      true
    );
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IFileExplorerUploadingResponsePayload,
    };
  } catch (error: any) {
    return {
      success: false,
      functionResult: error.error ?? { message: 'Unknown error' },
    };
  }
};
export const moving = async () => ({ success: false });
export const deleting = async () => ({ success: false });

export const previewing = async (
  { input: { apiService, previewFileDTO } }:
  { input: { apiService: ApiService; previewFileDTO: IPreviewFileDTO } }
): Promise<ICommonFunctionResult<IFileExplorerPreviewingResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(USER_FILE_PREVIEW, previewFileDTO, {}, true);
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
