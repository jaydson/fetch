import { consumed, decode } from './lib/helpers';
console

class Fetch {

    constructor() {
        console.log('constructor');
    }
}

class Headers {

	constructor (headers) {
		this.map = {};

		if (headers instanceof Headers) {
			headers.forEach(function(name, values) {
				values.forEach(function(value) {
					self.append(name, value);
				});
			});
	    } else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function(name) {
				self.append(name, headers[name]);
			});
	    }
	}

	append (name, value) {
		let list = this.map[name];
		if (!list) {
			list = [];
			this.map[name] = list;
		}
		list.push(value);
	}

	delete (name) {
		delete this.map[name];
	}

	get (name) {
		let values = this.map[name];
		return values ? values[0] : null;
	}

	getAll (name) {
		return this.map[name] || [];
	}

	has (name) {
		return this.map.hasOwnProperty(name);
	}

	set (name, value) {
    	this.map[name] = [value];
	}

	// Instead of iterable for now.
	forEach (callback) {
		Object.getOwnPropertyNames(this.map).forEach(function(name) {
			callback(name, this.map[name]);
		});
	}
}

class Body {
	constructor() {
		this.body = null;
		this.bodyUsed = false;
	}

	arrayBuffer () {
		throw new Error('Not implemented yet');
	}

	blob () {
		let rejected = consumed(this);
		return rejected ? rejected : Promise.resolve(new Blob([this.body]));
    }

	formData () {
		return Promise.resolve(decode(this.body));
	}

	json () {
		let rejected = consumed(this);
		if (rejected) {
			return rejected;
		}

		let body = this.body;

		return new Promise(function(resolve, reject) {
        	try {
          		resolve(JSON.parse(body));
        	} catch (ex) {
          		reject(ex);
        	}
		});
    }

	text () {
		let rejected = consumed(this);
		return rejected ? rejected : Promise.resolve(this.body);
    }
}

class Request {
	constructor(url, options) {
		options = options || {};
		this.url = url;
		this.body = options.body;
		this.credentials = options.credentials || null;
		this.headers = new Headers(options.headers);
		this.method = options.method || 'GET';
		this.mode = options.mode || null;
		this.referrer = null;
	}

	fetch () {
	    return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();

			xhr.onload = function() {
				let options = {
					status: xhr.status,
					statusText: xhr.statusText,
					headers: headers(xhr)
				};

				resolve(new Response(xhr.responseText, options));
			};

			xhr.onerror = function() {
				reject();
			};

			xhr.open(this.method, this.url);

			this.headers.forEach(function(name, values) {
				values.forEach(function(value) {
			  		xhr.setRequestHeader(name, value);
				});
			});

			xhr.send(this.body);
	    });
  }
}

class Response {
	constructor(body, options) {
		this.body = body;
		this.type = 'default';
		this.url = null;
		this.status = options.status;
		this.statusText = options.statusText;
		this.headers = options.headers;
	}
}

function headers(xhr) {
	let head = new Headers();
	let pairs = xhr.getAllResponseHeaders().trim().split('\n');

	pairs.forEach(function(header) {
		let split = header.trim().split(':');
		let key = split.shift().trim();
		let value = split.join(':').trim();
		head.append(key, value);
	});
	return head;
}

export default Fetch;
export { Headers, Body, Request, Response };
