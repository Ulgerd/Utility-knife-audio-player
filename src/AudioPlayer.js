import React, { Component } from 'react';
import Marquee from 'react-text-marquee';
import Slider from './components/slider.js';
import Button from './components/button.js';
import playlist from './audio/playlist.json';
import './App.css';

function addZero (num) {
  return num > 9 ? num.toString() : `0${num}`
}

class AudioPlayer extends Component {

  state = {
    playlist: [],
    currentTrack: 0,
    currentTime: null,
    duration: null,
    isPlaying: false,
    volume: 80,
    mute: false,
  }

  componentDidMount() {
    this.setState({
      playlist: [...playlist]
    })

    this.audio.onloadedmetadata = () => {
	this.setState({duration: this.audio.duration});
    };

    this.audio.onplay = () => {
      this.currentTimeInterval = setInterval( () => {
        this.setState({currentTime: this.audio.currentTime})
      }, 500);
    };

    this.audio.onpause = () => {
      clearInterval(this.currentTimeInterval);
      if (Math.floor(this.audio.currentTime) === Math.floor(this.audio.duration)) {
        this.setState({
          currentTrack: this.state.currentTrack+1,
          currentTime: 0,
          isPlaying: false
        })
        this.onPlay();
      }
    };
  }

  onBackward = () => {
    let {currentTrack} = this.state;
    if (currentTrack !== 0) {
      this.setState({
        currentTrack: currentTrack-1,
        currentTime: 0,
        isPlaying: false
      })
    }
  }

  onForward = () => {
    let {playlist, currentTrack} = this.state;
    if (currentTrack < playlist.length-1)
    this.setState({
      currentTrack: currentTrack+1,
      currentTime: 0,
      isPlaying: false
    })
  }

  onPlay = () => {
    if (this.audio.paused) {
      this.audio.play();
    } else if (!this.audio.paused) {
      this.audio.pause()
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }

  onStop = () => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.setState({
      currentTime: 0,
      isPlaying: false
    })
  }

  onMute = () => {
    let mute = this.audio.muted
    this.setState({
      mute: !mute
    })
    this.audio.muted = !mute;
  }

  onVolumeChange = (volume) => {
    this.setState({
      volume: volume
    })
    this.audio.volume = volume/100;
  }

  onCurrentTimeChange = (value) => {
    this.setState({
      currentTime: value
    })
    this.audio.currentTime = value;
  }

  render() {
    let {playlist, currentTrack, currentTime, duration, isPlaying, mute} = this.state;

    let currentTimeMin = addZero(Math.floor(currentTime / 60));
    let currentTimeSec = addZero(Math.floor(currentTime % 60));
    let durationMin = addZero(Math.floor(duration / 60));
    let durationSec = addZero(Math.floor(duration % 60));

    let src = !!playlist[currentTrack] ?
      playlist[currentTrack].url : null;

    let artist = !!playlist[currentTrack] ?
      !!playlist[currentTrack].artist ?
        playlist[currentTrack].artist + " -" :
        'Unknown artist -' :
      null;

    let title = !!playlist[currentTrack] ?
      !!playlist[currentTrack].title ?
        playlist[currentTrack].title :
        'Unknown composition' :
      null;

    return (
      <div className='audio-player-wrapper gradient-player'>

        <audio
          src={src}
          ref={(ref) => {
            this.audio = ref
          }}
        />

        <div className = "button-wrapper">
          <Button
            name={'backward'}
            color={'rgb(22, 122, 157)'}
            size={32}
            onClick={this.onBackward}
          />
          <Button
            name={isPlaying ? 'pause' : 'play'}
            color={'rgb(22, 122, 157)'}
            size={32}
            onClick={this.onPlay}
          />
          <Button
            name={'stop'}
            color={'rgb(22, 122, 157)'}
            size={32}
            onClick={this.onStop}
          />
          <Button
            name={'forward'}
            color={'rgb(22, 122, 157)'}
            size={32}
            onClick={this.onForward}
          />
        </div>

        <div className="timer-wrapper unselected">
          <div className="timer">
            {currentTimeMin}:{currentTimeSec}
          </div>
          <div className="timer">
            {durationMin}:{durationSec}
          </div>
        </div>

        <div className="slider-text">
          <Slider
            width = {300}
            height = {15}
            value = {currentTime}
            max = {duration}
            onValueChange = {this.onCurrentTimeChange}
            classBack='music-slider'
            classFront='music-slider-inner'
          />
          <div className="running-text">
           <Marquee text={`${artist} ${title}`} />
          </div>
        </div>

        <div>
          <div className="brand unselected">
            Utility Knife Player
          </div>

          <div className = "mute-wrapper">

            <div className='mute'>
              <Button
                name={mute ? 'volume-mute' : 'volume-max'}
                color={'rgb(22, 122, 157)'}
                size={25}
                onClick={this.onMute}
              />
            </div>

            <div className='volume'>
              <Slider
                width = {100}
                height = {10}
                value = {this.state.volume}
                onValueChange = {this.onVolumeChange}
                classBack='volume-slider'
                classFront='volume-slider-inner'
              />
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default AudioPlayer
