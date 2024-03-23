class MPFlutter_Wechat_AudioElement {
  constructor(src) {
    this.src = src;
    this.loop = false;
    this.paused = false;
    this.playbackRate = 1.0;
    this.balance = undefined;
  }

  setLoop(value) {
    this.loop = value;
    if (this.source) {
      this.source.loop = value;
    }
  }

  setPlaybackRate(value) {
    this.playbackRate = value;
    if (this.source) {
      this.source.playbackRate.value = value;
    }
  }

  setBalance(value) {
    this.balance = value;
    if (this.stereoPanner) {
      this.stereoPanner.pan.value = value;
    }
  }

  async load() {
    const window = getApp()._flutter.window;
    const response = await window.fetch(this.src);
    const buffer = await response.arrayBuffer();
    if (this.audioContext && this.source) {
      const audioBuffer = await new Promise((resolve, reject) => {
        this.audioContext.decodeAudioData(
          buffer,
          (result) => {
            resolve(result);
          },
          (err) => {
            reject(err);
          }
        );
      });
      this.source.buffer = audioBuffer;
      this.stereoPanner = this.audioContext.createStereoPanner();
      this.source.connect(this.stereoPanner);
      this.stereoPanner.connect(this.audioContext.destination);
      if (this.balance !== undefined) {
        this.stereoPanner.pan.value = this.balance;
      }
      this.source.loop = this.loop;
      this.source.playbackRate.value = this.playbackRate;
      this.source.onended = () => {
        this.onPlayEnded?.();
      };
    }
    this.onLoadedData?.();
  }

  currentTime() {
    if (this.audioContext) {
      return this.audioContext.currentTime;
    }
    return 0;
  }

  setCurrentTime(value) {
    this._currentTime = value;
  }

  duration() {
    if (this.source && this.source.buffer) {
      return this.source.buffer.duration;
    }
    return 0;
  }

  async play() {
    if (this.paused && this.audioContext) {
      this.audioContext.resume()
    }
    else if (this.source && this.audioContext) {
      this.source.connect(this.audioContext.destination);
      this.source.start(0, this._currentTime ?? 0);
    }
    this.paused = false;
  }

  pause() {
    if (this.audioContext) {
      this.audioContext.suspend()
    }
    this.paused = true;
  }
}

class MPFlutter_Wechat_AudioContext {
  constructor() {
    this.audioContext = wx.createWebAudioContext();
  }

  createMediaElementSource(audioElement) {
    const source = this.audioContext.createBufferSource();
    audioElement.audioContext = this.audioContext;
    audioElement.source = source;
    return source;
  }
}

wx.MPFlutter_Wechat_AudioElement = MPFlutter_Wechat_AudioElement;
wx.MPFlutter_Wechat_AudioContext = MPFlutter_Wechat_AudioContext;
