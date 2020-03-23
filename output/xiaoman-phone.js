/* xiaoman-phone.js version 2.0.0 */
var xiaoman = (function(CryptoJS) {
  'use strict';

  var ReturnCode;
  (function(ReturnCode) {
    ReturnCode['Success'] = '000000';
    ReturnCode['Error'] = '999999';
    ReturnCode['ParamIsNull'] = '100000';
    ReturnCode['ParamError'] = '100001';
    ReturnCode['AuthFail'] = '300000';
  })(ReturnCode || (ReturnCode = {}));
  var ReturnMsg;
  (function(ReturnMsg) {
    ReturnMsg['Success'] = '\u64CD\u4F5C\u6210\u529F';
    ReturnMsg['Error'] = '\u7CFB\u7EDF\u5185\u90E8\u9519\u8BEF';
    ReturnMsg['ParamIsNull'] = '\u5FC5\u9009\u9879\u4E3A\u7A7A';
    ReturnMsg['ParamError'] = '\u53C2\u6570\u683C\u5F0F\u4E0D\u6B63\u786E';
    ReturnMsg['AuthFail'] = '\u9274\u6743\u5931\u8D25';
  })(ReturnMsg || (ReturnMsg = {}));
  var Api = {
    uc: {
      login: '/api/v1/account/login',
      logout: '/api/v1/account/logout',
      queryAccountInfo: '/api/v1/account/{businessId}/queryAccountInfo',
    },
  };

  var Log = /** @class */ (function() {
    function Log() {}
    Log.info = function(module, msg, data) {};
    Log.warn = function(module, msg, data) {};
    Log.error = function(module, msg, data) {};
    return Log;
  })();

  var Store = /** @class */ (function() {
    function Store() {}
    Store.setUserInfo = function(info) {
      this.userInfo = info;
    };
    Store.setToken = function(token) {
      this.token = token;
    };
    return Store;
  })();

  function getRequestUrl(service, url) {
    url = service + url;
    if (url.indexOf('token=') >= 0) {
      return url;
    }
    if (url.indexOf('?') > 0) {
      url += '&token=' + getToken();
    } else {
      url += '?token=' + getToken();
    }
    return url;
  }
  function getToken() {
    return '';
  }
  function ajaxPost(url, param) {
    if (param === void 0) {
      param = {};
    }
    return new Promise(function(resolve, reject) {
      fetch(url, {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(param),
      })
        .then(function(resp) {
          if (resp.status !== 200) {
            reject && reject();
          } else {
            resp.json().then(function(data) {
              resolve && resolve(data);
            });
          }
        })
        ['catch'](function(err) {
          reject && reject();
        });
    });
  }

  var Config = /** @class */ (function() {
    function Config() {}
    Config.service = {
      uc: 'https://unify.kxjlcc.com:8443/uc-api',
      sdkServer: 'https://unify.kxjlcc.com:8443/sdk-server',
    };
    Config.sip = {
      register: true,
      register_expires: 30,
      socketURL: 'wss://unify.kxjlcc.com:8443/fswss',
      sipURI: '@webrtc',
      iceURL: ['stun:unify.kxjlcc.com:3478'],
    };
    Config.im = {
      serverName: '@xiaomankf.com',
      resource: '/tserver-client',
      server: 'wss://agent.kxjlcc.com:5291',
    };
    return Config;
  })();

  var SERVICE = Config.service.uc;
  function login(param) {
    return ajaxPost(getRequestUrl(SERVICE, Api.uc.login), param);
  }

  var MODULE = 'BASE';
  var Base = /** @class */ (function() {
    function Base() {}
    Base.prototype.login = function(param) {
      var account = param.account,
        password = param.password,
        success = param.success,
        fail = param.fail;
      var ret = {
        code: ReturnCode.Success,
        desc: ReturnMsg.Success,
      };
      Log.info(MODULE, '账号登录', { account: account, password: password });
      if (!account || !password) {
        ret.code = ReturnCode.ParamIsNull;
        ret.desc = ReturnMsg.ParamIsNull;
        Log.info(MODULE, '登录失败', ret);
        fail && fail(ret);
        return;
      }
      //密码加密处理
      var timestamp = new Date().getTime();
      var secKey = 'kxjl' + account + timestamp;
      var realKey = CryptoJS.SHA1(CryptoJS.SHA1(secKey).toString())
        .toString()
        .substring(0, 32);
      var encrypt = CryptoJS.AES.encrypt(password, CryptoJS.enc.Hex.parse(realKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      var reqParam = {
        phone: account,
        password: encrypt.ciphertext.toString(),
        timestamp: timestamp,
      };
      login(reqParam)
        .then(function(resp) {
          if (resp.code != '0') {
            ret.code = ReturnCode.AuthFail;
            ret.desc = ReturnMsg.AuthFail;
            Log.error(MODULE, '登录失败', ret);
            return;
          }
          var data = resp.result && resp.result.rows ? resp.result.rows[0] : {},
            token = data && data.token ? data.token.access_token : '',
            dn = data && data.agent ? data.agent.dn : '';
          if (!dn) {
            Log.warn(MODULE, '未找到对应分机号');
          }
          //保存用户信息
          var userInfo = {
            account: account,
            dn: dn,
            token: token,
            outshowtel: data ? data.lines || [] : [],
          };
          //设置userInfo
          Store.setUserInfo(userInfo);
          Log.info(MODULE, '登录成功', userInfo);
          //setTimeout(()=>{this.saveLog();},10000);
          ret.token = token;
          ret.outshowtel = userInfo.outshowtel;
          success && success(ret);
        })
        ['catch'](function() {
          ret.code = ReturnCode.AuthFail;
          ret.desc = ReturnMsg.AuthFail;
          Log.error(MODULE, '登录失败', ret);
          fail && fail(ret);
        });
    };
    return Base;
  })();

  var Phone = /** @class */ (function() {
    function Phone() {}
    return Phone;
  })();

  var xiaoman = /** @class */ (function() {
    function xiaoman() {}
    xiaoman.base = new Base();
    xiaoman.phone = new Phone();
    return xiaoman;
  })();

  return xiaoman;
})(CryptoJS);
