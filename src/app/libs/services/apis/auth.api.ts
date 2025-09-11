import camelcaseKeys from 'camelcase-keys';

import { IApiResponse, IAuthSigningInResponsePayload, ICommonFunctionResult, IErrorResponsePayload } from "../../types";
import { AUTH_URL } from '../../consts';
import { ApiService } from '../api.service';
import { IAuthDTO } from '../../dtos';

export const signingIn = async ({ input: { apiService, authDTO } }: { input: { apiService: ApiService; authDTO: IAuthDTO } }): Promise<ICommonFunctionResult<IAuthSigningInResponsePayload> | ICommonFunctionResult<IErrorResponsePayload>> => {
  try {
    const result: IApiResponse = await apiService.post(AUTH_URL, authDTO);
    return {
      success: result.success,
      functionResult: camelcaseKeys(result.payload, { deep: true }) as IAuthSigningInResponsePayload,
    } as ICommonFunctionResult<IAuthSigningInResponsePayload>;
  } catch(error: any) {
    return {
      success: false,
      functionResult: error.error,
    } as ICommonFunctionResult<IErrorResponsePayload>; 
  }
};
