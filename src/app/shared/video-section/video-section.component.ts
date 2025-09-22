import { Component, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Video {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  url: string;
  thumbnail: string;
  duration: string;
  views?: number;
  likes?: number;
  uploadDate?: string;
  category?: string;
}

interface RelatedContent {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  type: 'article' | 'service' | 'department' | 'guide';
  typeIcon: string;
  url?: string;
}

interface VideoPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
}

interface PlaylistSettings {
  autoPlay: boolean;
  shuffle: boolean;
  repeat: boolean;
  showThumbnails: boolean;
}

@Component({
  selector: 'app-video-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-section.component.html',
  styleUrl: './video-section.component.scss',
  host: {
    '(document:keydown)': 'onKeyDown($event)',
    '(document:fullscreenchange)': 'onFullscreenChange($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class VideoSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainVideo') mainVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlaylist') videoPlaylistRef!: ElementRef;

  // Component State
  selectedVideoIndex: number = 0;
  playedVideos: number[] = [];
  videoProgress: number = 0;
  isComponentVisible: boolean = false;
  isMobile: boolean = false;
  isTablet: boolean = false;

  // Video Player State
  playerState: VideoPlayerState = {
    isPlaying: false,
    isPaused: false,
    isLoading: true,
    hasError: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    playbackRate: 1
  };

  // Playlist Settings
  playlistSettings: PlaylistSettings = {
    autoPlay: false,
    shuffle: false,
    repeat: false,
    showThumbnails: true
  };

  // Intervals and Observers
  private progressInterval?: number;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private keyboardListenerActive = false;

  // Sample view counts for demonstration
  private viewCounts = [2500, 1800, 3200, 1500, 4100, 2900, 3800];

  // Videos Data
  videos: Video[] = [
    {
      id: 1,
      title: 'مرحباً بكم في مجمعنا الطبي المتطور',
      description: 'جولة شاملة داخل مجمعنا الطبي ومرافقه المتطورة، تعرف على أقسامنا المختلفة والخدمات المتميزة التي نقدمها لمرضانا بأعلى معايير الجودة العالمية.',
      shortDescription: 'جولة شاملة داخل مجمعنا الطبي والمرافق المتطورة',
      url: '/assets/videos/hospital-tour.mp4',
      thumbnail: '/assets/images/home/heroimg.png',
      duration: '5:23',
      views: 2500,
      likes: 98,
      category: 'جولة عامة',
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'قسم الطوارئ - خدمة على مدار الساعة',
      description: 'تعرف على قسم الطوارئ المجهز بأحدث التقنيات والمعدات الطبية، ومعايير الجودة العالمية التي نتبعها في الرعاية العاجلة والاستجابة السريعة للحالات الطارئة.',
      shortDescription: 'قسم الطوارئ والخدمات العاجلة المتقدمة',
      url: '/assets/videos/emergency-department.mp4',
      thumbnail: '/assets/images/home/heroimg.png',
      duration: '3:45',
      views: 1800,
      likes: 95,
      category: 'أقسام طبية',
      uploadDate: '2024-01-10'
    },
    {
      id: 3,
      title: 'عيادات التخصصات الطبية المتقدمة',
      description: 'استعراض لعياداتنا المتخصصة في مختلف المجالات الطبية مع أطباء خبراء وكوادر مدربة على أعلى المستويات، وأحدث الأجهزة التشخيصية والعلاجية.',
      shortDescription: 'العيادات المتخصصة والخدمات الطبية المتنوعة',
      url: '/assets/videos/specialized-clinics.mp4',
      thumbnail: '/assets/images/home/heroimg.png',
      duration: '4:12',
      views: 3200,
      likes: 97,
      category: 'عيادات متخصصة',
      uploadDate: '2024-01-08'
    },
    {
      id: 4,
      title: 'مختبر التشخيص والتحاليل الطبية',
      description: 'جولة في مختبرنا المجهز بأحدث الأجهزة والتقنيات للحصول على نتائج دقيقة وسريعة في جميع أنواع التحاليل الطبية والفحوصات التشخيصية المتقدمة.',
      shortDescription: 'مختبر التحاليل والتشخيص المتقدم بأحدث التقنيات',
      url: '/assets/videos/laboratory.mp4',
      thumbnail: '/assets/images/home/heroimg.png',
      duration: '2:56',
      views: 1500,
      likes: 92,
      category: 'مختبرات',
      uploadDate: '2024-01-05'
    },
    {
      id: 5,
      title: 'شهادات المرضى وقصص الشفاء الملهمة',
      description: 'استمع لتجارب مرضانا الإيجابية وقصص الشفاء المؤثرة التي تعكس جودة الرعاية الصحية المقدمة في مجمعنا والتزامنا بتقديم أفضل الخدمات الطبية.',
      shortDescription: 'شهادات وتجارب المرضى الحقيقية وقصص النجاح',
      url: '/assets/videos/patient-testimonials.mp4',
      thumbnail: '/assets/images/home/heroimg.png',
      duration: '6:18',
      views: 4100,
      likes: 99,
      category: 'شهادات',
      uploadDate: '2024-01-20'
    }
  ];

  // Related Content Data
  relatedContent: RelatedContent[] = [
    {
      id: 1,
      title: 'دليل المريض الشامل',
      description: 'كل ما تحتاج معرفته عن خدماتنا وإجراءات الحجز والمراجعة',
      thumbnail: '/assets/images/home/heroimg.png',
      type: 'guide',
      typeIcon: 'fas fa-file-alt',
      url: '/patient-guide'
    },
    {
      id: 2,
      title: 'خدمات الفحص الشامل',
      description: 'برامج فحص شاملة للكشف المبكر عن الأمراض والوقاية',
      thumbnail: '/assets/images/home/heroimg.png',
      type: 'service',
      typeIcon: 'fas fa-stethoscope',
      url: '/services/comprehensive-checkup'
    },
    {
      id: 3,
      title: 'قسم جراحة القلب والأوعية الدموية',
      description: 'أحدث التقنيات في جراحة القلب والأوعية الدموية',
      thumbnail: '/assets/images/related/cardiology.jpg',
      type: 'department',
      typeIcon: 'fas fa-heartbeat',
      url: '/departments/cardiology'
    },
    {
      id: 4,
      title: 'برنامج التأهيل الطبي',
      description: 'برامج تأهيل متكاملة لما بعد العمليات والإصابات',
      thumbnail: '/assets/images/home/heroimg.png',
      type: 'service',
      typeIcon: 'fas fa-dumbbell',
      url: '/services/rehabilitation'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeComponent();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.setupObservers();
        this.initializeVideoPlayer();
        this.checkDeviceType();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Initialization Methods
  private initializeComponent(): void {
    this.setupKeyboardListeners();
    this.preloadVideoThumbnails();
  }

  private setupObservers(): void {
    this.setupIntersectionObserver();
    this.setupResizeObserver();
  }

  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const options = {
      root: null,
      rootMargin: '0px 0px -20% 0px',
      threshold: [0.1, 0.5]
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isComponentVisible = entry.isIntersecting && entry.intersectionRatio >= 0.1;

        if (!this.isComponentVisible && this.playerState.isPlaying) {
          this.pauseVideo();
        }
      });
    }, options);

    // Observe the main video section
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
      this.intersectionObserver.observe(videoSection);
    }
  }

  private setupResizeObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('ResizeObserver' in window)) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.checkDeviceType();
      this.handleVideoResize();
    });

    if (this.mainVideoRef?.nativeElement) {
      this.resizeObserver.observe(this.mainVideoRef.nativeElement);
    }
  }

  private initializeVideoPlayer(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (!video) return;

    // Set initial video properties
    video.preload = 'metadata';
    video.playsInline = true;

    // Add video event listeners
    video.addEventListener('loadstart', () => this.onVideoLoadStart());
    video.addEventListener('loadedmetadata', () => this.onVideoLoadedMetadata());
    video.addEventListener('loadeddata', () => this.onVideoLoadedData());
    video.addEventListener('canplay', () => this.onVideoCanPlay());
    video.addEventListener('timeupdate', () => this.onVideoTimeUpdate());
    video.addEventListener('ended', () => this.onVideoEnded());
    video.addEventListener('error', (e) => this.onVideoError(e));
    video.addEventListener('waiting', () => this.onVideoWaiting());
    video.addEventListener('playing', () => this.onVideoPlaying());
    video.addEventListener('pause', () => this.onVideoPause());
  }

  // Getters
  get selectedVideo(): Video {
    return this.videos[this.selectedVideoIndex] || this.videos[0];
  }

  get isVideoPlaying(): boolean {
    return this.playerState.isPlaying;
  }

  get autoPlayEnabled(): boolean {
    return this.playlistSettings.autoPlay;
  }

  get canPlayNext(): boolean {
    return this.selectedVideoIndex < this.videos.length - 1;
  }

  get canPlayPrevious(): boolean {
    return this.selectedVideoIndex > 0;
  }

  // Video Control Methods
  selectVideo(index: number): void {
    if (index === this.selectedVideoIndex || index < 0 || index >= this.videos.length) {
      return;
    }

    // Pause current video
    this.pauseCurrentVideo();

    // Reset player state
    this.resetPlayerState();

    // Update selected video
    this.selectedVideoIndex = index;

    // Mark as played
    this.markVideoAsPlayed(index);

    // Smooth scroll to selected video in playlist
    this.scrollToSelectedVideo();

    // Update UI
    this.cdr.detectChanges();

    // Auto-play if enabled
    if (this.playlistSettings.autoPlay) {
      setTimeout(() => this.playVideo(), 300);
    }
  }

  playVideo(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (!video) {
      this.handleVideoError('عنصر الفيديو غير متوفر');
      return;
    }

    this.playerState.isLoading = true;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.playerState.isPlaying = true;
        this.playerState.isPaused = false;
        this.playerState.isLoading = false;
        this.playerState.hasError = false;
        this.startProgressTracking();
        this.markVideoAsPlayed(this.selectedVideoIndex);
        this.cdr.detectChanges();
      }).catch(error => {
        console.error('Error playing video:', error);
        this.handleVideoError('فشل في تشغيل الفيديو. يرجى المحاولة مرة أخرى.');
        this.playerState.isLoading = false;
        this.cdr.detectChanges();
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
      this.resetPlayerState();
    }
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
    this.playerState.currentTime = 0;
    this.videoProgress = 0;
    this.clearProgressInterval();
  }

  // Video Event Handlers
  onVideoLoadStart(): void {
    this.playerState.isLoading = true;
    this.playerState.hasError = false;
    this.cdr.detectChanges();
  }

  onVideoLoadedMetadata(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      this.playerState.duration = video.duration;
      this.playerState.volume = video.volume;
      this.playerState.isMuted = video.muted;
    }
  }

  onVideoLoadedData(): void {
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
      this.playerState.currentTime = video.currentTime;
      this.videoProgress = (video.currentTime / video.duration) * 100;
    }
  }

  onVideoPlaying(): void {
    this.playerState.isPlaying = true;
    this.playerState.isPaused = false;
    this.playerState.isLoading = false;
    this.startProgressTracking();
    this.markVideoAsPlayed(this.selectedVideoIndex);
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

    // Handle auto-play next video
    if (this.playlistSettings.autoPlay) {
      this.handleAutoPlayNext();
    }

    this.cdr.detectChanges();
  }

  onVideoError(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const error = video.error;

    let errorMessage = 'حدث خطأ في تحميل الفيديو';

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت.';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'خطأ في فك ترميز الفيديو.';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'تنسيق الفيديو غير مدعوم.';
          break;
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'تم إلغاء تحميل الفيديو.';
          break;
        default:
          errorMessage = 'حدث خطأ غير معروف في الفيديو.';
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
    this.playerState.isLoading = false;
    this.playerState.isPlaying = false;
    this.clearProgressInterval();

    // Show error notification (implement your notification service)
    this.showErrorNotification(message);
    this.cdr.detectChanges();
  }

  // Progress Tracking
  private startProgressTracking(): void {
    this.clearProgressInterval();

    this.progressInterval = window.setInterval(() => {
      const video = this.mainVideoRef?.nativeElement;
      if (video && video.duration && !video.paused) {
        this.playerState.currentTime = video.currentTime;
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

  // Playlist Methods
  playNextVideo(): void {
    if (this.canPlayNext) {
      this.selectVideo(this.selectedVideoIndex + 1);
    } else if (this.playlistSettings.repeat) {
      this.selectVideo(0);
    }
  }

  playPreviousVideo(): void {
    if (this.canPlayPrevious) {
      this.selectVideo(this.selectedVideoIndex - 1);
    } else if (this.playlistSettings.repeat) {
      this.selectVideo(this.videos.length - 1);
    }
  }

  private handleAutoPlayNext(): void {
    setTimeout(() => {
      if (this.playlistSettings.shuffle) {
        this.playRandomVideo();
      } else {
        this.playNextVideo();
      }
    }, 1000);
  }

  private playRandomVideo(): void {
    const availableVideos = this.videos
      .map((_, index) => index)
      .filter(index => index !== this.selectedVideoIndex);

    if (availableVideos.length > 0) {
      const randomIndex = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      this.selectVideo(randomIndex);
    }
  }

  private markVideoAsPlayed(index: number): void {
    if (!this.playedVideos.includes(index)) {
      this.playedVideos.push(index);
    }
  }

  // Playlist Settings
  toggleAutoPlay(): void {
    this.playlistSettings.autoPlay = !this.playlistSettings.autoPlay;
    this.savePlaylistSettings();
  }

  toggleShuffle(): void {
    this.playlistSettings.shuffle = !this.playlistSettings.shuffle;
    this.savePlaylistSettings();
  }

  toggleRepeat(): void {
    this.playlistSettings.repeat = !this.playlistSettings.repeat;
    this.savePlaylistSettings();
  }

  private savePlaylistSettings(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('videoPlaylistSettings', JSON.stringify(this.playlistSettings));
    }
  }

  private loadPlaylistSettings(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('videoPlaylistSettings');
      if (saved) {
        try {
          this.playlistSettings = { ...this.playlistSettings, ...JSON.parse(saved) };
        } catch (error) {
          console.warn('Failed to load playlist settings:', error);
        }
      }
    }
  }

  // Volume and Playback Controls
  setVolume(volume: number): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.volume = Math.max(0, Math.min(1, volume));
      this.playerState.volume = video.volume;
      this.playerState.isMuted = video.volume === 0;
      this.cdr.detectChanges();
    }
  }

  toggleMute(): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.muted = !video.muted;
      this.playerState.isMuted = video.muted;
      this.cdr.detectChanges();
    }
  }

  setPlaybackRate(rate: number): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.playbackRate = rate;
      this.playerState.playbackRate = rate;
      this.cdr.detectChanges();
    }
  }

  seekTo(percentage: number): void {
    const video = this.mainVideoRef?.nativeElement;
    if (video && video.duration) {
      const time = (percentage / 100) * video.duration;
      video.currentTime = time;
      this.videoProgress = percentage;
      this.cdr.detectChanges();
    }
  }

  // Fullscreen Methods
  toggleFullscreen(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const video = this.mainVideoRef?.nativeElement;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  onFullscreenChange(event: Event): void {
    this.playerState.isFullscreen = !!document.fullscreenElement;
    this.cdr.detectChanges();
  }

  // Keyboard Navigation
  onKeyDown(event: KeyboardEvent): void {
    if (!this.keyboardListenerActive || !this.isComponentVisible) return;

    const video = this.mainVideoRef?.nativeElement;
    if (!video) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.playerState.isPlaying ? this.pauseVideo() : this.playVideo();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (event.shiftKey) {
          this.playPreviousVideo();
        } else {
          video.currentTime = Math.max(0, video.currentTime - 10);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (event.shiftKey) {
          this.playNextVideo();
        } else {
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.setVolume(this.playerState.volume + 0.1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.setVolume(this.playerState.volume - 0.1);
        break;

      case 'KeyM':
        event.preventDefault();
        this.toggleMute();
        break;

      case 'KeyF':
        event.preventDefault();
        this.toggleFullscreen();
        break;

      case 'Escape':
        if (this.playerState.isFullscreen) {
          event.preventDefault();
          this.toggleFullscreen();
        }
        break;
    }
  }

  private setupKeyboardListeners(): void {
    this.keyboardListenerActive = true;
  }

  // Utility Methods
  getViewCount(index: number): string {
    const views = this.videos[index]?.views || this.viewCounts[index] || Math.floor(Math.random() * 3000) + 500;
    return this.formatNumber(views);
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDuration(duration: string): string {
    return duration;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private scrollToSelectedVideo(): void {
    if (!this.videoPlaylistRef?.nativeElement) return;

    setTimeout(() => {
      const playlist = this.videoPlaylistRef.nativeElement;
      const selectedItem = playlist.querySelector(`[data-index="${this.selectedVideoIndex}"]`);

      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }, 100);
  }

  private checkDeviceType(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
    this.cdr.detectChanges();
  }

  private handleVideoResize(): void {
    // Handle video player resize if needed
    this.cdr.detectChanges();
  }

  onWindowResize(event: Event): void {
    this.checkDeviceType();
    this.handleVideoResize();
  }

  // Social and Sharing Methods
  shareVideo(): void {
    const video = this.selectedVideo;
    const shareData = {
      title: video.title,
      text: video.description,
      url: window.location.href + `?video=${video.id}`
    };

    if (isPlatformBrowser(this.platformId) && navigator.share) {
      navigator.share(shareData).catch(err => {
        console.error('Error sharing:', err);
        this.fallbackShare(shareData.url);
      });
    } else {
      this.fallbackShare(shareData.url);
    }
  }

  private fallbackShare(url: string): void {
    if (isPlatformBrowser(this.platformId) && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showSuccessNotification('تم نسخ الرابط بنجاح');
      }).catch(() => {
        this.showErrorNotification('فشل في نسخ الرابط');
      });
    }
  }

  toggleLike(): void {
    const video = this.selectedVideo;
    console.log('Toggle like for video:', video.id);
    // Implement like functionality with API
  }

  toggleFavorite(): void {
    const video = this.selectedVideo;
    console.log('Toggle favorite for video:', video.id);
    // Implement favorite functionality
  }

  // Notification Methods (implement with your notification service)
  private showErrorNotification(message: string): void {
    console.error(message);
    // Implement with your notification service
  }

  private showSuccessNotification(message: string): void {
    console.log(message);
    // Implement with your notification service
  }

  // Performance Methods
  private preloadVideoThumbnails(): void {
    this.videos.forEach(video => {
      const img = new Image();
      img.src = video.thumbnail;
    });
  }

  // Tracking Methods
  private trackVideoPlay(videoId: number): void {
    if (isPlatformBrowser(this.platformId) && (window as any).gtag) {
      (window as any).gtag('event', 'video_play', {
        event_category: 'video_section',
        event_label: `video_${videoId}`
      });
    }
  }

  private trackVideoComplete(videoId: number): void {
    if (isPlatformBrowser(this.platformId) && (window as any).gtag) {
      (window as any).gtag('event', 'video_complete', {
        event_category: 'video_section',
        event_label: `video_${videoId}`
      });
    }
  }

  // Template Helper Methods
  trackByVideoId(index: number, item: Video): number {
    return item.id;
  }

  trackByRelatedId(index: number, item: RelatedContent): number {
    return item.id;
  }

  isVideoPlayed(index: number): boolean {
    return this.playedVideos.includes(index);
  }

  getVideoItemClass(index: number): string {
    const classes = ['video-item'];

    if (index === this.selectedVideoIndex) {
      classes.push('active');
    }

    if (this.isVideoPlayed(index)) {
      classes.push('played');
    }

    return classes.join(' ');
  }

  // Cleanup
  private cleanup(): void {
    this.clearProgressInterval();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.keyboardListenerActive = false;

    // Remove video event listeners
    const video = this.mainVideoRef?.nativeElement;
    if (video) {
      video.removeEventListener('loadstart', this.onVideoLoadStart);
      video.removeEventListener('loadedmetadata', this.onVideoLoadedMetadata);
      video.removeEventListener('loadeddata', this.onVideoLoadedData);
      video.removeEventListener('canplay', this.onVideoCanPlay);
      video.removeEventListener('timeupdate', this.onVideoTimeUpdate);
      video.removeEventListener('ended', this.onVideoEnded);
      video.removeEventListener('error', this.onVideoError);
      video.removeEventListener('waiting', this.onVideoWaiting);
      video.removeEventListener('playing', this.onVideoPlaying);
      video.removeEventListener('pause', this.onVideoPause);
    }
  }
}
