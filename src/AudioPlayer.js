import React, { Component } from 'react';
import Marquee from 'react-text-marquee';
import { throttle } from 'throttle-debounce';
import Audio from './components/audio.js';
import Slider from './components/slider.js';
import Button from './components/button.js';
import playlist from './audio/playlist.json';
import './App.css';

const addZero = (num) => {
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
    stopped: false
  }

  componentDidMount() {
    this.setState({
      playlist: [...playlist]
    })
  }

  getDataFromAudio = (data) => {
    this.setState({
      ...this.state, ...data
    })
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
    let {playlist, currentTrack} = this.state
    if (currentTrack < playlist.length-1) {
      this.setState({
        currentTrack: currentTrack+1,
        currentTime: 0,
        isPlaying: false
      })
    }
  }

  onPlay = () => {
    let {isPlaying} = this.state
    this.setState({
      isPlaying: !isPlaying,
      stopped: false
    })
  }

  onStop = () => {
    this.setState({
      currentTime: 0,
      isPlaying: false,
      stopped: true
    })
  }

  onMute = () => {
    this.setState({
      mute: !this.audio.muted
    })
  }

  onVolumeChange = throttle(300, (volume) => {
    this.setState({
      volume: volume
    })
  })

  onCurrentTimeChange = throttle(300,(value) => {
    this.setState({
      currentTime: value
    })
  })

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

        <Audio
          src={src}
          data = {this.state}
          sendData = {this.getDataFromAudio}
          onPlay={this.onPlay}
        />

        <div className = "button-wrapper">
          <Button
            name={'backward'}
            disabled = {currentTrack===0 ? true:false}
            color={currentTrack===0 ? 'rgb(163, 222, 242)' : 'rgb(22, 122, 157)'}
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
            disabled = {currentTrack===playlist.length-1 ? true:false}
            color={currentTrack===playlist.length-1 ? 'rgb(163, 222, 242)' : 'rgb(22, 122, 157)'}
            size={32}
            onClick={this.onForward}
          />
        </div>

        <div className="timer-wrapper unselectable">
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
          <div className="brand unselectable">
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
