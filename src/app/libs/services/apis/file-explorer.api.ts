import { IApiResponse, ICommonFunctionResult, IErrorResponsePayload, TFileExplorerListingResponsePayload } from "../../types";
import { USER_FILE_LIST } from '../../consts';

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

export const previewing = async () => {
  return { success: false };
}
