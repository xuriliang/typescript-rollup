export interface UserInfo {
	account: string;
	dn: string;
	token?: string;
	outshowtel?: Array<string>;
}

export class Store {
	constructor() {}

	static userInfo: UserInfo;
	static token: string;

	static setUserInfo(info: UserInfo): void {
		this.userInfo = info;
	}

	static setToken(token: string): void {
		this.token = token;
	}

	
}
