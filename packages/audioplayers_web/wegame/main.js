class MPFlutter_Wechat_AudioElement {
  constructor(src) {
    this.src = src;
    this.loop = false;
  }

  setLoop(value) {
    this.loop = value;
    if (this.source) {
      this.source.loop = value;
    }
  }

  async load() {
    const window = getApp()._flutter.window;
    const response = await window.fetch(this.src);
    const buffer = await response.arrayBuffer();
    if (this.audioContext && this.source) {
      const audioBuffer = await new Promise((resolve, reject) => {
        this.audioContext.decodeAudioData(
          buffer, (result) => {
            resolve(result)
          }, (err) => {
            reject(err);
          }
        );
      });
      this.source.buffer = audioBuffer;
      this.source.loop = this.loop;
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

  play() {
    if (this.source && this.audioContext) {
      this.source.connect(this.audioContext.destination);
      this.source.start(0, this._currentTime ?? 0);
    }
  }

  pause() {
    if (this.source) {
      this.source.disconnect();
      this.source.stop();
    }
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
