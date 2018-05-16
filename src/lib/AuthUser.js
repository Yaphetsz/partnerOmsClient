/**
 * 授权用户
 * Created by fu_gh on 2018-01-08 16:57
 */

const DEFAULT_USER_ID_KEY = 'uid';
const DEFAULT_USER_NAME_KEY = 'uname';
const DEFAULT_SSO_URL_KEY = 'sso';
const INVALID_BEFORE_URL_KEY = 'ibeforeurl';
class AuthUser {

    /**
     * 保存用户基本信息
     * @param param
     */
    static saveUser(param) {
        if (param.id) {
            sessionStorage.setItem(DEFAULT_USER_ID_KEY, param.id);
        }
        if (param.name) {
            sessionStorage.setItem(DEFAULT_USER_NAME_KEY, param.name);
        }
        if (param.sso) {
            sessionStorage.setItem(DEFAULT_SSO_URL_KEY, param.sso);
        }
    }

    /**
     * 用户名称
     */
    static getUserName() {
        return sessionStorage.getItem(DEFAULT_USER_NAME_KEY);
    }

    /**
     * 设置会话失效前的url
     * @param url
     */
    static setInvalidBeforeUrl(url){
        if(!sessionStorage.getItem(INVALID_BEFORE_URL_KEY)){
            sessionStorage.setItem(INVALID_BEFORE_URL_KEY,url);
        }
    }

    /**
     * 设置sso地址
     * @param sso
     */
    static setSSOUrl(sso){
        sessionStorage.setItem(DEFAULT_SSO_URL_KEY, sso);
    }
    /**
     * 取会话失效前的url
     */
    static getInvalidBeforeUrl(){
        return sessionStorage.getItem(INVALID_BEFORE_URL_KEY);
    }

    /**
     * sso地址
     */
    static getSSOUrl() {
        return sessionStorage.getItem(DEFAULT_SSO_URL_KEY);
    }
    /**
     * 清除用户基本信息
     */
    static clearUser() {
        sessionStorage.clear();
    }

    /**
     * 检查是否授权
     * @returns {boolean}
     */
    static check() {
        if (sessionStorage.getItem(DEFAULT_USER_ID_KEY) || sessionStorage.getItem(DEFAULT_USER_NAME_KEY)) {
            return true;
        } else {
            return false;
        }
    }

}

export default  AuthUser;
