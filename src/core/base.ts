import * as CryptoJS from "crypto-js";
import { ReturnCode, ReturnMsg } from "./constant";
import Log from "./log";
import { Store, UserInfo } from "./store";
import { login } from "../http/uc";

interface LoginParam {
	account: string;
	password: string;
	success?: Function;
	fail?: Function;
}

interface LoginReturn {
	code: string;
	desc: string;
	token?: string;
	outshowtel?: Array<string>;
}

const MODULE = "BASE";

class Base {
	constructor() {}

	login(param: LoginParam) {
		let { account, password, success, fail } = param;
		let ret: LoginReturn = {
			code: ReturnCode.Success,
			desc: ReturnMsg.Success
		};
		Log.info(MODULE, "账号登录", { account, password });
		if (!account || !password) {
			ret.code = ReturnCode.ParamIsNull;
			ret.desc = ReturnMsg.ParamIsNull;
			Log.info(MODULE, "登录失败", ret);
			fail && fail(ret);
			return;
		}
		//密码加密处理
		let timestamp = new Date().getTime();
		let secKey = "kxjl" + account + timestamp;
		let realKey = CryptoJS.SHA1(CryptoJS.SHA1(secKey).toString())
			.toString()
			.substring(0, 32);
		let encrypt = CryptoJS.AES.encrypt(
			password,
			CryptoJS.enc.Hex.parse(realKey),
			{
				mode: CryptoJS.mode.ECB,
				padding: CryptoJS.pad.Pkcs7
			}
		);
		let reqParam = {
			phone: account,
			password: encrypt.ciphertext.toString(),
			timestamp: timestamp
		};

		login(reqParam)
			.then(resp => {
				if (resp.code != "0") {
					ret.code = ReturnCode.AuthFail;
					ret.desc = ReturnMsg.AuthFail;
					Log.error(MODULE, "登录失败", ret);
					return;
				}
				let data = resp.result && resp.result.rows ? resp.result.rows[0] : {},
					token = data && data.token ? data.token.access_token : "",
					dn = data && data.agent ? data.agent.dn : "";
				if (!dn) {
					Log.warn(MODULE, "未找到对应分机号");
				}
				//保存用户信息
				let userInfo: UserInfo = {
					account: account,
					dn: dn,
					token: token,
					outshowtel: data ? data.lines || [] : []
				};
				//设置userInfo
				Store.setUserInfo(userInfo);
				Log.info(MODULE, "登录成功", userInfo);
				//setTimeout(()=>{this.saveLog();},10000);
				ret.token = token;
				ret.outshowtel = userInfo.outshowtel;
				success && success(ret);
			})
			.catch(() => {
				ret.code = ReturnCode.AuthFail;
				ret.desc = ReturnMsg.AuthFail;
				Log.error(MODULE, "登录失败", ret);
				fail && fail(ret);
			});
	}
}

export default Base;
