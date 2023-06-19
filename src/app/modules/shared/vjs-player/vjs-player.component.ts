import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-vjs-player',
  templateUrl: './vjs-player.component.html',
  styleUrls: ['./vjs-player.component.scss'],
})
export class VjsPlayerComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy, OnChanges
{
  @Input() streamUrl = '';
  @Input() id = 'video';
  @Input() controls = false;
  @Input() bigPlayButton = true;
  @Input() imageUrl: any;
  @Input() autoplay = true;
  @Input() doReset: boolean = false;

  muted: boolean = true;
  playBackSpeed: number = 1;
  hover = false;
  imageLoaded = false;
  showVideo = false;
  duration: string = '';
  currentTime: string = '';
  player!: videojs.Player;

  hideSkeleton = false;

  public speedList = [0.5, 0.75, 1, 1.5, 2];
  constructor() {}

  ngOnInit() {
    this.muted = true;
    setTimeout(() => {
      this.autoplay = false;
    }, 10); 
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.autoplay && this.player){
      this.autoplay = changes.autoplay.currentValue;
      if(this.autoplay){
        this.player.play();
      }else{
        this.player.pause();
      }
      this.player.controls(false);
    }
  }

  initilizeVideo() {
    const options = {
      fluid: true,
      controls: this.controls,
      autoplay: this.autoplay,
      loop: true,
      LoadingSpinner: true,
      bigPlayButton: this.bigPlayButton,
      sources: [
        {
          src: this.streamUrl,
          type:
            this.streamUrl.indexOf('.mp4') > 0
              ? 'video/mp4'
              : 'application/x-mpegURL',
        },
      ],
    };

    let el = document.getElementById(this.id);
    if (el) {
      this.player = videojs(el, options);

      this.player.one('loadedmetadata', () => {
        let duration = this.player.duration();
        this.duration = videojs.formatTime(duration,0);
      });
      this.player.on('timeupdate', () => {
        this.currentTime = videojs.formatTime(this.player.currentTime(),0);
      });
    }
  }

  ngAfterViewInit(): void {
    this.initilizeVideo();
    // setTimeout(() => {
    //   this.player.play();
    //   setTimeout(() => {
    //     this.player.pause();
    //   }, 100);
    // }, 1000);
  }

  ngAfterViewChecked(): void {
    if (this.doReset) {
      this.doReset = false;
      this.initilizeVideo();
    }
  }

  public togglePlayVideo(doplay: boolean) {
    if (doplay) this.player.play();
    else this.player.pause();
  }

  public muteUnmuteVideo() {
    if (this.player) {
      this.muted = !this.muted;
      this.player.muted(this.muted);
    }
  }

  ngOnDestroy() {
    this.player?.dispose();
  }
}
