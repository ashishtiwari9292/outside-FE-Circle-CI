import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './common/services/socket.service';
import { SharedService } from './modules/shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'outside-fe';

  constructor(
    private router: Router,
    private socketService: SocketService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.userData$.subscribe((res: any) => {
      if (res.username) {
        this.socketService.emitEvent('loginRoom', { username: res.username });
      }
    });
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
