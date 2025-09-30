import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

interface Video {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  url: string;
  thumbnail: string;
  duration: string;
}

interface VideoPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  isMuted: boolean;
  isFullScreen: boolean;
}

interface PlaylistSettings {
  autoPlay: boolean;
  repeat: boolean;
}

@Component({
  selector: 'app-video-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-section.component.html',
  styleUrls: ['./video-section.component.scss']
})
export class VideoSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainVideo') mainVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlaylist') videoPlaylistRef!: ElementRef;

  selectedVideoIndex: number = 0;
  videoProgress: number = 0;
  isComponentVisible: boolean = false;

  playerState: VideoPlayerState = {
    isPlaying: false,
    isPaused: false,
    isLoading: true,
    hasError: false,
    errorMessage: undefined,
    isMuted: true,
    isFullScreen: false
  };

  playlistSettings: PlaylistSettings = {
    autoPlay: true,
    repeat: true
  };

  videos: Video[] = [];
  translations: { [key: string]: string } = {};

  private progressInterval?: number;
  private intersectionObserver?: IntersectionObserver;
  private languageSubscription?: Subscription;

  // Static video metadata to complement TranslationService data
  private videoMetadata: Partial<Video>[] = [
    {
      id: 1,
      url: '../../../assets/images/media/media-vid1.mp4',
      thumbnail: '/assets/images/logo.png',
      duration: '5:23'
    },
    {
      id: 2,
      url: '../../../assets/images/media/media-vid2.mp4',
      thumbnail: '/assets/images/logo.png',
      duration: '3:45'
    },
    {
      id: 3,
      url: '../../../assets/images/media/media-vid3.mp4',
      thumbnail: '/assets/images/logo.png',
      duration: '4:12'
    },
    {
      id: 4,
      url: '../../../assets/images/media/media-vid4.mp4',
      thumbnail: '/assets/images/logo.png',
      duration: '2:56'
    }
  ];

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.preloadVideoThumbnails();
      this.loadTranslations();
      this.languageSubscription = this.translationService.getCurrentLanguage().subscribe(() => {
        this.loadTranslations();
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.setupIntersectionObserver();
        this.initializeVideoPlayer();
        const video = this.mainVideoRef?.nativeElement;
        if (video && this.videos.length > 0) {
          video.src = this.videos[0].url;
          video.load();
          if (this.playlistSettings.autoPlay) {
            this.playVideo();
          }
        }
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  private loadTranslations(): void {
    // Fetch video data from TranslationService
    const videoData = this.translationService.getTranslation<{ title: string; description: string; shortDescription: string }[]>('media.videos');
    this.videos = videoData.map((video, index) => ({
      ...video,
      ...this.videoMetadata[index]
    })) as Video[];

    // Fetch other translations
    this.translations = {
      section_badge: this.translationService.getStringTranslation('media.hero_badge'),
      section_title: this.translationService.getStringTranslation('media.hero_title_main'),
      section_subtitle: this.translationService.getStringTranslation('media.hero_description'),
      video_not_supported: this.translationService.getStringTranslation('media.video_not_supported'),
      play_video: this.translationService.getStringTranslation('media.play_video'),
      pause_video: this.translationService.getStringTranslation('media.pause_video'),
      play: this.translationService.getStringTranslation('media.play'),
      pause: this.translationService.getStringTranslation('media.pause'),
      stop: this.translationService.getStringTranslation('media.stop'),
      replay: this.translationService.getStringTranslation('media.replay'),
      mute: this.translationService.getStringTranslation('media.mute'),
      unmute: this.translationService.getStringTranslation('media.unmute'),
      fullscreen: this.translationService.getStringTranslation('media.fullscreen'),
      exit_fullscreen: this.translationService.getStringTranslation('media.exit_fullscreen'),
      playlist_title: this.translationService.getStringTranslation('media.playlist_title'),
      videos_count: this.translationService.getStringTranslation('media.videos_count')
    };

    this.cdr.detectChanges();
  }

  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isComponentVisible = entry.isIntersecting;
        if (!this.isComponentVisible && this.playerState.isPlaying) {
          this.pauseVideo();
        }
      });
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.1 });

    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
      this.intersectionObserver.observe(videoSection);
    }
  }

  private initializeVideoPlayer(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (!video) return;

    video.preload = 'metadata';
    video.playsInline = true;

    video.addEventListener('loadedmetadata', () => this.onVideoLoadedMetadata());
    video.addEventListener('canplay', () => this.onVideoCanPlay());
    video.addEventListener('timeupdate', () => this.onVideoTimeUpdate());
    video.addEventListener('error', (e) => this.onVideoError(e));
    video.addEventListener('waiting', () => this.onVideoWaiting());
    video.addEventListener('playing', () => this.onVideoPlaying());
    video.addEventListener('pause', () => this.onVideoPause());
  }

  get selectedVideo(): Video {
    return this.videos[this.selectedVideoIndex] || this.videos[0] || {} as Video;
  }

  get isVideoPlaying(): boolean {
    return this.playerState.isPlaying;
  }

  get autoPlayEnabled(): boolean {
    return this.playlistSettings.autoPlay;
  }

  selectVideo(index: number): void {
    if (index === this.selectedVideoIndex || index < 0 || index >= this.videos.length) {
      return;
    }

    this.pauseCurrentVideo();
    this.resetPlayerState();
    this.selectedVideoIndex = index;

    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.src = this.videos[index].url;
      video.load();
      if (this.playlistSettings.autoPlay) {
        this.playVideo();
      }
    } else {
      this.handleVideoError(this.translations['video_element_missing'] || 'Video element is not available');
    }

    this.scrollToSelectedVideo();
    this.cdr.detectChanges();
  }

  playVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (!video) {
      this.handleVideoError(this.translations['video_element_missing'] || 'Video element is not available');
      return;
    }

    video.muted = this.playerState.isMuted;
    this.playerState.isLoading = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.playerState.isPlaying = true;
          this.playerState.isPaused = false;
          this.playerState.isLoading = false;
          this.playerState.hasError = false;
          this.startProgressTracking();
          this.cdr.detectChanges();
        })
        .catch(error => {
          console.error('Error playing video:', error);
          this.handleVideoError(this.translations['play_error'] || 'Failed to play video. Please try manually.');
        });
    }
  }

  pauseVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video && !video.paused) {
      video.pause();
    }
  }

  stopVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
      this.playerState.isPlaying = false;
      this.playerState.isPaused = true;
      this.videoProgress = 0;
      this.clearProgressInterval();
      this.cdr.detectChanges();
    }
  }

  replayVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.currentTime = 0;
      this.videoProgress = 0;
      this.playVideo();
    }
  }

  toggleMute(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      this.playerState.isMuted = !this.playerState.isMuted;
      video.muted = this.playerState.isMuted;
      this.cdr.detectChanges();
    }
  }

  toggleFullScreen(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (!video) return;

    if (!this.playerState.isFullScreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
      this.playerState.isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.playerState.isFullScreen = false;
    }
    this.cdr.detectChanges();
  }

  private pauseCurrentVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video && !video.paused) {
      video.pause();
      this.clearProgressInterval();
    }
  }

  private resetPlayerState(): void {
    this.playerState.isPlaying = false;
    this.playerState.isPaused = false;
    this.playerState.isLoading = true;
    this.playerState.hasError = false;
    this.playerState.errorMessage = undefined;
    this.videoProgress = 0;
    this.clearProgressInterval();
  }

  onVideoLoadedMetadata(): void {
    this.playerState.isLoading = false;
    this.cdr.detectChanges();
  }

  onVideoCanPlay(): void {
    this.playerState.isLoading = false;
    this.playerState.hasError = false;
    this.cdr.detectChanges();
  }

  onVideoTimeUpdate(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video && video.duration) {
      this.videoProgress = (video.currentTime / video.duration) * 100;
      this.cdr.detectChanges();
    }
  }

  onVideoPlaying(): void {
    this.playerState.isPlaying = true;
    this.playerState.isPaused = false;
    this.playerState.isLoading = false;
    this.startProgressTracking();
    this.cdr.detectChanges();
  }

  onVideoPause(): void {
    this.playerState.isPlaying = false;
    this.playerState.isPaused = true;
    this.clearProgressInterval();
    this.cdr.detectChanges();
  }

  onVideoEnded(): void {
    this.playerState.isPlaying = false;
    this.playerState.isPaused = false;
    this.videoProgress = 100;
    this.clearProgressInterval();
    if (this.playlistSettings.repeat) {
      this.playVideo();
    } else if (this.playlistSettings.autoPlay && this.selectedVideoIndex < this.videos.length - 1) {
      this.selectVideo(this.selectedVideoIndex + 1);
    }
    this.cdr.detectChanges();
  }

  onVideoError(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const error = video.error;
    let errorMessage = this.translations['video_load_error'] || 'Error loading video';
    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = this.translations['video_format_error'] || 'Video format not supported or file not found.';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = this.translations['network_error'] || 'Network error. Please ensure the file exists.';
          break;
        default:
          errorMessage = this.translations['unknown_error'] || 'Unknown video error.';
      }
    }
    this.handleVideoError(errorMessage);
  }

  onVideoWaiting(): void {
    this.playerState.isLoading = true;
    this.cdr.detectChanges();
  }

  private handleVideoError(message: string): void {
    console.error('Video Error:', message);
    this.playerState.hasError = true;
    this.playerState.errorMessage = message;
    this.playerState.isLoading = false;
    this.playerState.isPlaying = false;
    this.clearProgressInterval();
    this.cdr.detectChanges();
  }

  private startProgressTracking(): void {
    this.clearProgressInterval();
    this.progressInterval = window.setInterval(() => {
      const video = this.mainVideoRef?.nativeElement;
      if (video && video.duration && !video.paused) {
        this.videoProgress = (video.currentTime / video.duration) * 100;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  private clearProgressInterval(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  toggleAutoPlay(): void {
    this.playlistSettings.autoPlay = !this.playlistSettings.autoPlay;
    this.cdr.detectChanges();
  }

  toggleRepeat(): void {
    this.playlistSettings.repeat = !this.playlistSettings.repeat;
    this.cdr.detectChanges();
  }

  private preloadVideoThumbnails(): void {
    this.videos.forEach(video => {
      const img = new Image();
      img.src = video.thumbnail;
    });
  }

  private scrollToSelectedVideo(): void {
    if (!this.videoPlaylistRef?.nativeElement) return;
    setTimeout(() => {
      const playlist = this.videoPlaylistRef.nativeElement;
      const selectedItem = playlist.querySelector(`[data-index="${this.selectedVideoIndex}"]`);
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  private cleanup(): void {
    this.clearProgressInterval();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.removeEventListener('loadedmetadata', this.onVideoLoadedMetadata);
      video.removeEventListener('canplay', this.onVideoCanPlay);
      video.removeEventListener('timeupdate', this.onVideoTimeUpdate);
      video.removeEventListener('error', this.onVideoError);
      video.removeEventListener('waiting', this.onVideoWaiting);
      video.removeEventListener('playing', this.onVideoPlaying);
      video.removeEventListener('pause', this.onVideoPause);
    }
  }
}
