import { getRequestUrl, ajaxPost } from './http';
import { Api } from '../core/constant';
import Config from '../core/config';

const SERVICE = Config.service.uc;

export function login(param: { phone: string; password: string; timestamp: number }) {
	return ajaxPost(getRequestUrl(SERVICE, Api.uc.login), param);
}
