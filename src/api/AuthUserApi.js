/**
 * 授权用户
 * Created by fu_gh on 2018-01-08 16:54
 */

import BaseAPI from './BaseApi';

class AuthUser extends BaseAPI{

    /**
     * 授权检查
     * @returns {AxiosPromise}
     */
    check(){
        return this._apiGet('/api/auth/check');
    }

    /**
     * 用户信息
     * @returns {AxiosPromise}
     */
    getUser(){
        return this._apiGet('/api/auth/user');
    }

    /**
     * 菜单信息
     * @returns {AxiosPromise}
     */
    getMenus(){
        return this._apiGet('/api/auth/menus');
    }

}

export default AuthUser;
