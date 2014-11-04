function consumed(body) {
	if (body.bodyUsed) {
		return Promise.reject(new TypeError('Body already consumed'));
	}
	body.bodyUsed = true;
}

function decode(body) {
	let form = new FormData();

	body.trim().split('&').forEach(function(bytes) {
		if (bytes) {
			let split = bytes.split('=');
			let name = split.shift().replace(/\+/g, ' ');
			let value = split.join('=').replace(/\+/g, ' ');
			form.append(decodeURIComponent(name), decodeURIComponent(value));
		}
	});
	return form;
}

export { consumed, decode };