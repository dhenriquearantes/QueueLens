import axios from 'axios';

interface IAxios {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  contentType?: string;
  data?: any;
  responseType?: 'json' | 'blob' | 'text' | 'stream' | 'document' | 'formdata' | 'arraybuffer';
}

export async function useAxios<T = any>({
  url,
  method,
  token,
  contentType = 'application/json',
  data,
  responseType = 'json'
}: IAxios): Promise<any> {
  try {
    return await axios<T>({
      url,
      method,
      headers: {
        Authorization: token ?? '',
        'Content-Type': contentType
      },
      data,
      responseType,
    });
  } catch (error: any) {
    console.error('ERROR:', error.message);
    if (error?.cause) {
      console.error(error.cause);
    }

    console.error('🔍 AxiosError Details:');
    console.error('↳ Status:', error?.response?.status);
    console.error('↳ Status Text:', error?.response?.statusText);
    console.error('↳ URL:', error?.config?.url);
    console.error('↳ Headers:', error?.config?.headers);
    console.error('↳ Data Sent:', error?.config?.data);
    console.error('↳ Response Data:', error?.response?.data);

    throw new Error(error);
  }
}