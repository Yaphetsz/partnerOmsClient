/**
 *  api基类
 * Created by fu_gh on 2018-01-08 16:42
 */

import axios from 'axios'

class BaseAPI{
    /**
     * 构造
     */
    constructor(){
        this.axios = axios
    }
    /**
     *  GET 请求
     * @param url
     * @param param
     * @returns {AxiosPromise}
     * @private
     */
    _apiGet(url,param){
        if(param){
            return this.axios.get(url,{params:param});
        } else {
            return this.axios.get(url,param)
        }
    }
    /**
     * POST 请求
     * @param url
     * @param param
     * @returns {AxiosPromise}
     * @private
     */
    _apiPost(url,param){
        return this.axios.post(url,param)
    }
}
export default BaseAPI
