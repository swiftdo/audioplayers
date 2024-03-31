class MPFlutter_Wechat_AudioElement {
  constructor(src) {
    this.src = src;
    this.loop = false;
    this.playbackRate = 1.0;
    this.balance = undefined;
    this.volume = undefined;
  }

  setLoop(value) {
    this.loop = value;
    if (this.audioContext) {
        this.audioContext.loop = value;
    }
  }

  setPlaybackRate(value) {
    this.playbackRate = value;
    if (this.audioContext) {
        this.audioContext.playbackRate = value;
    }
  }

  setBalance(value) {
    this.balance = value;
    // TODO: 待实现
  }

  setVolume(value) {
    this.volume = value;
    if (this.audioContext) {
        this.audioContext.volume = value;
    }
  }

  async load() {
    if (this.audioContext) {
      this.audioContext.autoplay = true
      this.audioContext.src = this.src;

      this.audioContext.onEnded = (e) => {
        this.onPlayEnded?.();
      }

      this.audioContext.loop = this.loop;
      this.audioContext.playbackRate = this.playbackRate;
      this.audioContext.volume = this.volume;
      this.onLoadedData?.();
     }
  }

  currentTime() {
    if (this.audioContext) {
      return this.audioContext.currentTime;
    }
    return 0;
  }

  setCurrentTime(value) {
    if (this.audioContext) {
        this.audioContext.currentTime = value;
    }
  }

  duration() {
    if (this.audioContext) {
        return this.audioContext.duration;
    }
    return 0;
  }

  async play() {
    if (this.audioContext) {
        this.audioContext.play();
    }
  }

  pause() {
    if (this.audioContext) {
        this.audioContext.pause();
    }
  }
}

class MPFlutter_Wechat_AudioContext {
  constructor() {
    this.audioContext = wx.createInnerAudioContext();
  }

  createMediaElementSource(audioElement) {
    // TODO：为什么需要这个方法
    var tx = wx.createWebAudioContext();
    const source = tx.createBufferSource();
    audioElement.audioContext = this.audioContext;
    audioElement.source = source;
    return source;
  }
}

wx.MPFlutter_Wechat_AudioElement = MPFlutter_Wechat_AudioElement;
wx.MPFlutter_Wechat_AudioContext = MPFlutter_Wechat_AudioContext;
