export interface ReturnData {
	code: string;
	desc: string;
}

export enum ReturnCode {
	Success = "000000",
	Error = "999999",
	ParamIsNull = "100000",
	ParamError = "100001",
	AuthFail = "300000"
}

export enum ReturnMsg {
	Success = "操作成功",
	Error = "系统内部错误",
	ParamIsNull = "必选项为空",
	ParamError = "参数格式不正确",
	AuthFail = "鉴权失败"
}

export const Api = {
	uc: {
		login: "/api/v1/account/login",
		logout: "/api/v1/account/logout",
		queryAccountInfo: "/api/v1/account/{businessId}/queryAccountInfo"
	}
};
