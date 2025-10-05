export function message(message: string) {
	console.log('\x1b[32m%s\x1b[0m', message);
}

export function log(message: string, data: any) {
	console.log('\x1b[33m%s\x1b[0m', message, data);
}

export function error(message: string, data: any) {
	console.log('\x1b[31m%s\x1b[0m', message, data);
}
