import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
const logmaxlen = 120;


export class HttpWrapper {
    provider: AxiosInstance;

    constructor(opts: AxiosRequestConfig) {
        this.provider = axios.create(
            Object.assign(
                {
                    headers: { 'Content-Type': 'application/json' },
                },
                opts,
            ),
        );

        this.provider.interceptors.response.use(
            function(response) {
                console.log('got response:', response.config.url, JSON.stringify(response.data).slice(0, logmaxlen));
                return response;
            },
            function(error) {
                const errData = error.response ? error.response.data : { error: error.message };
                const errStr = (typeof errData === 'string' ? errData : JSON.stringify(errData)).slice(0, logmaxlen);
                const errUrl = error.response ? error.response.config.url : error.address;
                console.log('got response:', errUrl, 'err=', errStr);
                return Promise.reject(error);
            },
        );
    }

    async send(url: string, jsonRequestData: any): Promise<any> {
        console.log('sending request:', url, JSON.stringify(jsonRequestData || {}).slice(0, logmaxlen));
        const response = await this.provider.post(url, jsonRequestData);
        return response.data;
    }
}
