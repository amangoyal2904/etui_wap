import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import  apiConfig from "./config.json";

export type GetRequest = AxiosRequestConfig | null

interface Return<Data, Error>
    extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate'
    > {
    data: Data | undefined
    isLoading: boolean
    response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
    extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
    > {
    fallbackData?: Data
}

export default function useRequest<Data = unknown, Error = unknown>(
    request: GetRequest,
    { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
    let { url, params, headers, ...rest } = request;
    const env = process.env['NODE_ENV'] && process.env['NODE_ENV'].trim() || "production";
    url = apiConfig[url] && apiConfig[url]["dns"][env] && apiConfig[url]["dns"][env][0] + apiConfig[url]["path"] || url;
    const requestConfig = { ...request!, url, params, headers, ...rest };
    const { data: response, error, isValidating, mutate } = useSWR<
        AxiosResponse<Data>,
        AxiosError<Error>
    >(
        request && JSON.stringify(request),
        /**
         * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
         * function is actually only called by `useSWR` when it isn't.
         */
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        () => axios.request<Data>(requestConfig),
        {
            ...config,
            fallbackData: fallbackData && {
                status: 200,
                statusText: 'InitialData',
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                config: request!,
                headers: {},
                data: fallbackData
            }
        }
    )

    return {
        data: response && response.data,
        response,
        isLoading: !error && !response,
        error,
        isValidating,
        mutate
    }
}