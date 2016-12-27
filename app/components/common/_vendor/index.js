'use strict';

require('antd/lib/index.css');
window._ = require('lodash');
window.$ = require('jquery');
window.React = require('react');
window.ReactDom = require('react-dom');
window.antd = require('antd');
window.liteFlux = require('lite-flux');
window.Cookie = require('js-cookie');
window.moment = require('moment');
window.ReactRouter = require('react-router');
window.SP = require('./sp');
// liteFlux 简单方法
window.A = function() {
    if (arguments.length === 1) {
        return liteFlux.store(arguments[0]).getAction();
    } else {
        return liteFlux.store(arguments[0]).addAction(arguments[1], arguments[2]);
    }
};
window.S = function() {
    if (arguments.length === 1) {
        return liteFlux.store(arguments[0]).getStore();
    } else {
        if (arguments[1] === null) {
            return liteFlux.store(arguments[0]).destroy();
        } else if (arguments[1] === true) {
            return liteFlux.store(arguments[0]).reset();
        } else {
            return liteFlux.store(arguments[0]).setStore(arguments[1]);
        }
    }
};

// 引用 webapi
var ERROR_AUTH_FAILED = 40001 // 未登录操作
,   PERMISSION_FORBIDDEN = 40003
,   SERVER_ERROR = 500;
window.webapi = require('sipin-admin-api')({
    host: sipinConfig.apiHost,
    crossDomain: true,
    headers: {
        'X-XSRF-TOKEN': function (options) {
            var token = null;
            if (options.method.toLowerCase() != 'get') {
                token = Cookie.get('XSRF-TOKEN');
            }

            return token;
        }
    },
    success: function (data) {
        var res = data.data;
        if (res.code === ERROR_AUTH_FAILED) {
            SP.message.error('登录超时，请重新登录');
            setTimeout(function () {
                if(window.location.pathname=='/static-admin/preview/preview.html'){
                    location.replace('/login');
                }else{
                    location.hash = '/login';
                }
            }, 2);
        } else if (res.code == PERMISSION_FORBIDDEN) {
            SP.message.error('您没有该功能操作权限！');
        }
    },
    error: function (xhr) {
        var message = '网络发生未知错误！';
        if (xhr.status === 0 && xhr.readyState === 4) {
            message = '请检查是否断网了！';
        } else if (xhr.status === SERVER_ERROR) {
            message = '服务器目前很忙，请稍等或联系技术童鞋！';
        }

        SP.message.error(message);
    }
});

window.csrfToken = localStorage.getItem('csrf_token_form');
