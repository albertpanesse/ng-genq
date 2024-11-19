import { IAuthSigningInResponsePayload, ICommonFunctionResult } from "../types";

export const signingIn = async ({ input: { credential } }: any): Promise<ICommonFunctionResult<IAuthSigningInResponsePayload>> => {
  try {
    const result = await fetch('http://10.147.17.139:3000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credential)
    });

    const jsonBody = await result.json();
    if (jsonBody.statusCode == 200) {
      return {
        success: true,
        payload: jsonBody.payload as IAuthSigningInResponsePayload,
      } as ICommonFunctionResult<IAuthSigningInResponsePayload>;    
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error: any) {
    console.log('error', error);
    throw new Error('Unknown');
  }
};

export const signingOut = async () => {};
