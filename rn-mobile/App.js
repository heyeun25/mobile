import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
// import { ScreenOrientation } from 'expo';
// import { DeviceMotion } from 'expo-sensors';
import io from 'socket.io-client';
var socket;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.orientationCallbak = this.orientationListener.bind(this);
    // this.myVideo = React.createRef();
    // var that = this;
    
  }
  state = {
    showTextInput: true
  }

  _handleVideoRef = component => {
    this.playbackObject = component;
  }

  _textInput = component => {
    this.textInput = component;
  }

  orientationListener(e) {
    console.log(JSON.stringify(e.orientationInfo.orientation));
    // 3, 4 is

    // var o = e.orientationInfo.orientation;
    // if (o == 3 || o == 4) {
    //   // alert('oo');
    //   // this.playbackObject.pauseAsync();
    //   // this.playbackObject.stopAsync();
    //   var that = this;
    //   this.playbackObject.loadAsync(require("./assets/mobile_garo.mp4"))
    //     .then(() => {
    //       that.playbackObject.playAsync();
    //     })
    // } else {
    //   var that = this;
    //   this.playbackObject.loadAsync(require("./assets/mobile_sero.mp4"))
    //     .then(() => {
    //       that.playbackObject.playAsync();
    //     })
    // }
  }
  initSocket() {
    socket.on('connect', function() {
      socket.emit('identify', 'mobile');
    });
    var that = this;
    socket.on('appMsg', function(data) {
      // alert(data);
      if (!that || !that.playbackObject) return;
      switch (data.value.video) {
        case 'vertical':
          that.playbackObject.loadAsync(require("./assets/mobile_sero.mp4"))
            .then(() => {
              that.playbackObject.playAsync();
            })
          break;
        case 'second':
          that.playbackObject.loadAsync(require("./assets/mobile_sero_02.mp4"))
            .then(() => {
              that.playbackObject.playAsync();
            })
          break;
        case 'horizontal':
          that.playbackObject.loadAsync(require("./assets/mobile_garo.mp4"))
            .then(() => {
              that.playbackObject.playAsync();
            })
          break;
        case 'stop':
          that.playbackObject.stopAsync();
        default:
          break;
      }
      
    })
  }
  changeText(text) {
    console.log('text', text);
    this.text = text;
  }
  endEditing() {
    alert('http://192.168.0.' + this.text + ':8080');
    socket = io('http://192.168.0.' + this.text + ':8080', {
      forceNew: true
    });
    this.initSocket(socket);
    this.setState({
      showTextInput: false,
    })

  }
  componentDidMount() {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.ALL);
    }
    changeScreenOrientation();
    ScreenOrientation.addOrientationChangeListener(this.orientationCallbak);
    // DeviceMotion.isAvailableAsync();
    // DeviceMotion.addListener((e) => {
    //   // alert(e.orientation);
      
    // })
    // this.playbackObject.pauseAsync();
  }
  componentWillUnmount() {
    console.log('unmount');
    ScreenOrientation.removeOrientationChangeListeners();
  }
  render() {
    const { showTextInput } = this.state;
    return (
      <View style={styles.container}>
        {!showTextInput ? <Video
            ref={this._handleVideoRef}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          /> : null}
        {showTextInput ? 
        <TextInput
          ref={this._textInput}
          style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => this.changeText(text)}
          onEndEditing={text => this.endEditing(text)}
        /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  }
});
