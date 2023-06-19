import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  tap,
} from 'rxjs/operators';
import { isImage } from 'src/app/common/helpers/helpers';
import { UserService } from '../../user/user.service';
import { SearchedPost } from '../models/searched-post';
import { SearchedUser } from '../models/searched-user';
import { SharedApiService } from '../shared.api.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @Input() className: string;
  @Input() searchType: string = 'default';
  @Input() username: string | null = '';
  @Output() followers: EventEmitter<any> = new EventEmitter();
  @Output() following: EventEmitter<any> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  searchString: string;
  foundPosts: SearchedPost[];
  foundUsers: SearchedUser[];
  foundFollowedUsers: SearchedUser[];
  foundFollowingUsers: SearchedUser[];
  noResult: boolean = false;
  loadingSearch: boolean = false;
  constructor(
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('/search') == -1) {
          this.searchString = '';
          this.foundPosts = [];
          this.foundUsers = [];
        }
        this.loadingSearch = false;
      }
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap((event: any) => {
          if (event.target.value != null && event.target.value != undefined && event.target.value.trim() == '') {
            this.loadingSearch = false;
          } else {
            this.loadingSearch = true;
            this.noResult = false;
          }
        }),
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((event: any) => {
          if(event.keyCode != 13){
            if (!this.searchString || this.searchString.trim() == '') {
              this.loadingSearch = false;
              this.emptyData();
            } else {
              this.searchString = event.target.value;
              this.getData();
            }
          }
        })
      )
      .subscribe();
  }

  searchUsersAndPosts() {
    this.sharedApiService
      .searchUsersAndPosts(this.searchString, 'none', 1, 3)
      .subscribe(
        (res: any) => {
          this.loadingSearch = false;
          if (res.result) {
            this.foundUsers = res.result.users;
            this.foundPosts = res.result.posts;
            this.noResult = false;
            if (this.foundUsers.length == 0 && this.foundPosts.length == 0) {
              this.noResult = true;
            }
          }
        },
        (err: any) => {
          this.loadingSearch = false;
          console.log(err);
        }
      );
  }

  searchFollowedUsers() {
    this.isLoading.emit(true);
    this.userService
      .searchFollowedUsers(this.username || '', this.searchString, 1, 20)
      .subscribe(
        (res: any) => {
          this.loadingSearch = false;
          if (res.body) {
            this.foundFollowedUsers = res.body.data;
            this.followers.emit(this.foundFollowedUsers);
          }
          this.isLoading.emit(false);
        },
        (err: any) => {
          this.isLoading.emit(false);
          this.loadingSearch = false;
          console.log(err);
        }
      );
  }

  searchFollowingUsers() {
    this.isLoading.emit(true);
    this.userService
      .searchFollowingUsers(this.username || '', this.searchString, 1, 20)
      .subscribe(
        (res: any) => {
          this.loadingSearch = false;
          if (res.body) {
            this.foundFollowingUsers = res.body.data;
            this.following.emit(this.foundFollowingUsers);
          }
          this.isLoading.emit(false);
        },
        (err: any) => {
          this.isLoading.emit(false);
          this.loadingSearch = false;
          console.log(err);
        }
      );
  }

  emptyData() {
    if (this.searchType == 'followed') {
      this.foundFollowedUsers = [];
      this.followers.emit('empty');
    } else if (this.searchType == 'following') {
      this.foundFollowingUsers = [];
      this.following.emit('empty');
    } else {
      this.foundPosts = [];
      this.foundUsers = [];
    }
  }

  getData() {
    if (this.searchType == 'followed') {
      this.searchFollowedUsers();
    } else if (this.searchType == 'following') {
      this.searchFollowingUsers();
    } else {
      this.searchUsersAndPosts();
    }
  }

  searchSubmit() {
    if (!this.searchString || (this.searchString && this.searchString.trim() == '')) {
      return;
    }
    if (this.location.path().indexOf('/search') != -1) {
      this.sharedService.searchString$.next(this.searchString);
    } else {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchString },
      });
    }
  }

  onUserClick(username: string) {
    document.body.classList.remove('is-active');
    this.router.navigate([`user/${username}`]);
  }

  onPostClick(id: string) {
    document.body.classList.remove('is-active');
    this.router.navigate([`post/${btoa(id)}`]);
  }

  isImage(url: string){
    return isImage(url);
  }
}
