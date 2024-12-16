import { IApiResponse, IAuthSigningInResponsePayload, ICommonFunctionResult, IErrorResponsePayload } from "../../types";
import { AUTH_URL } from '../../consts';

export const signingIn = async ({ input: { apiService, credential } }: any): Promise<ICommonFunctionResult<IAuthSigningInResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(AUTH_URL, credential);
    return {
      success: result.success,
      functionResult: result.payload,
    } as ICommonFunctionResult<IAuthSigningInResponsePayload>;
  } catch(error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }
};
