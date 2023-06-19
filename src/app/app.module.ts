/** Angular Imports */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/** Local Imports */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppInterceptor } from './common/interceptors/app.interceptor';
/** Third Party Imports */
import { CookieService } from 'ngx-cookie-service';
import { NotFoundComponent } from './common/components/not-found/not-found.component';
import { SharedModule } from './modules/shared/shared.module';
import { SnackBarComponent } from './common/components/snack-bar/snack-bar.component';
import {MatIconModule} from '@angular/material/icon';
import { AuthModule } from './modules/auth/auth.module';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { PostComponent } from './modules/post/post.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMasonryModule } from 'ngx-masonry';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PostModule } from './modules/post/post.module';

const config: SocketIoConfig = {
	url: environment.socketUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent, SnackBarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    MatIconModule,
    AuthModule,
		SocketIoModule.forRoot(config),
    InfiniteScrollModule,
    NgxMasonryModule,
    SlickCarouselModule,
    // PostModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
