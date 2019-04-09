import React, {Component} from 'react';

class Audio extends Component {

  componentDidMount() {
    this.audio.onloadedmetadata = () => {
      this.props.sendData({duration: this.audio.duration})
    };

    this.audio.onplay = () => {
      this.currentTimeInterval = setInterval(() => {
        this.props.sendData({currentTime: this.audio.currentTime})
      }, 500);
    };

    this.audio.onpause = () => {
      clearInterval(this.currentTimeInterval);
      if (Math.floor(this.audio.currentTime) === Math.floor(this.audio.duration)) {
        this.props.sendData({
          currentTrack: this.props.data.currentTrack + 1,
          currentTime: 0,
          isPlaying: false
        })
        this.props.onPlay();
      }
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.data.currentTrack !== nextProps.data.currentTrack) {
      clearInterval(this.currentTimeInterval);
    }
    this.dealingWithAudio()
  }

  dealingWithAudio = () => {
    let {isPlaying, stopped, mute, volume, currentTime} = this.props.data;
    let audio = this.audio;

    if (isPlaying === audio.paused) {
      isPlaying
        ? this.audio.play()
        : this.audio.pause();
    }

    if (stopped) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (Math.floor(audio.currentTime) !== Math.floor(currentTime)) {
      audio.currentTime = currentTime;
    }

    audio.volume = volume / 100;
    audio.muted = mute;
  }

  render() {
    let {src} = this.props;
    return (
      <audio
        src={src}
        ref={(ref) => {this.audio = ref}}
      />
    )
  }
}

export default Audio;
