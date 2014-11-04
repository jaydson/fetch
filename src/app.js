import Fetch, { Request } from './fetch';

console.log(Request);

window.fetch = function (url, options) {
	return new Request(url, options).fetch();
}