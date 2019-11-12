/**
 * Created by gaolifa on 2018/4/23.
 */
import axios from 'axios';
import qs from 'qs';

let cancels = [];
// 初始化 设置钩子函数
let _before, _error, _success, _complete;
export function init(options) {
    const defaultOptions = {
        before() {},
        error() {},
        success() {},
        complete() {}
    };
    options = Object.assign({}, defaultOptions, options);
    _before = options.before;
    _error = options.error;
    _success = options.success;
    _complete = options.complete;
}

function handleError(err) {
    const isCanceled = err && err.message && err.message.canceled;
    if (isCanceled) return;
    _error(err);
}

function setOptions(axiosInstance) {
    axiosInstance.interceptors.request.use(
        config => {
            // 在发送请求之前做某事
            _before();
            return config;
        },
        error => {
            // 请求错误时做些事
            // _error(error)
            _complete();
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        response => {
            _success(response);
            _complete();
            return response;
        },
        error => {
            _complete();
            handleError(error);
            return Promise.reject(error);
        }
    );
}

export function fetch(options = {}) {
    const { globalHandle = true, isTransformRequest = true } = options;
    const CancelToken = axios.CancelToken;
    const config = {
        cancelToken: new CancelToken(c => {
            // 一个执行器函数接收一个取消函数作为参数
            cancels.push(c);
        })
    };
    if (isTransformRequest) {
        config.transformRequest = [
            data => {
                // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
                data = qs.stringify(data);
                return data;
            }
        ];
    }
    const instance = axios.create(config);
    // instance.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    instance.defaults.headers.get['Cache-Control'] = 'no-cache';
    instance.defaults.headers.get['Pragma'] = 'no-cache';
    instance.defaults.headers.common['Accept'] = '';
    instance.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded charset=utf-8';
    if (globalHandle) {
        setOptions(instance);
    }
    return instance;
}
/**
 * get请求参拼接url
 * @param {String} method 
 * @param {*String} url 
 * @param {*Object} data 
 */
export const http = (method, url, data) => {
  if (method === 'get') {
    let arr = [];
    let Url;
    if (data) {
      Object.entries(data).forEach(([k,val]) => {
        val && arr.push(`${k}=${val}`)
      })
      arr = arr.join('&')
      Url = url + '&' + arr
    } else {
      Url = url
    }
    return fetch().get(Url).then(res => res,err => {})
  } else if (method === 'post') {
    return fetch().post(url, data).then(res => res,err => {})
  }
};

export function cancelFetches() {
    cancels.forEach(cancel => {
        cancel({ canceled: true });
    });
    cancels = [];
}
