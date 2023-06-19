import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { closeSideBar } from 'src/app/common/helpers/helpers';
import { PostService } from '../../post/post.service';
import { SharedService } from '../../shared/shared.service';
import { SuggestedUser } from '../models/suggestedUser';
import { TrendingPost } from '../models/trendingPost';
import { UserService } from '../user.service';
@Component({
  selector: 'app-user-wrapper',
  templateUrl: './user-wrapper.component.html',
  styleUrls: ['./user-wrapper.component.scss'],
})
export class UserWrapperComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  isLoadingPosts: boolean = true;
  isLoadingUsers: boolean = true;
  isLoggedIn: boolean = false;
  trendingPosts: TrendingPost[];
  suggestedUsers: SuggestedUser[];
  constructor(
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res)=>{
      this.isLoggedIn = res;
      if(res){
        this.getSuggestedUsers();
      }else{
        this.isLoadingUsers = false;
      }
    })
    if(this.isLoggedIn){
      this.getSuggestedUsers();
    }
    this.getTrendingPosts();
    
  }

  getTrendingPosts() {
    this.postService.getTrendingPosts(1, 4).subscribe(
      (res: any) => {
        this.isLoadingPosts = false;
        if (res && res.length > 0) {
          this.trendingPosts = res;
        }
      },
      (err) => {
        this.isLoadingPosts = false;
        console.log(err);
      }
    );
  }

  getSuggestedUsers() {
    this.userService.getSuggestedUsers(1, 4).subscribe(
      (res: any) => {
        this.isLoadingUsers = false;
        if (res && res.length > 0) {
          this.suggestedUsers = res;
        }
      },
      (err) => {
        this.isLoadingUsers = false;
        console.log(err);
      }
    );
  }

  onPostClick(id: string) {
    this.router.navigate([`post/${btoa(id)}`]);
  }

  onUserClick(username: string){
    this.router.navigate([`user/${username}`]);
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }


  closeSideBar() {
    closeSideBar();
  }

  ngOnDestroy(){
    this.loginSubscription.unsubscribe();
  }
}
