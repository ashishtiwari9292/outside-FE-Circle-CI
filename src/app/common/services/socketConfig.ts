import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

export const socketioConfig: SocketIoConfig = {
	url: window.location.host.match('localhost:4200')
		? environment.socketioUrl
		: 'wss://' + window.location.hostname + ':' + (environment.socket_port || '3000'), // socket server url;
	options: {
		transports: ['websocket']
	}
};