import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) { 

  }

  // listen as observable
//   public getMessage(eventName:string) {
//     return new Observable(observer => {
//       this.socket.on(eventName, (message:any) => {
//         observer.next(message);
//       });
//     });
//   }

	// emit event
	 emitEvent(eventName: string,data :any = {}) {
		this.socket.emit(eventName,data);
	} 

	// listen event
	listen(eventName:string): Observable<any> {
		return this.socket.fromEvent(eventName);
	}

  removeListener(eventName: string){
    return this.socket.removeListener(eventName);
  }

  removeAllListeners(eventName: string){
    return this.socket.removeAllListeners(eventName);
  }
}