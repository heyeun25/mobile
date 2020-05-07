export default class AudioTool {
	constructor(audioEl) {
		// this.soundURL = mp3 || null;
		this.audioContext = null;
		this.audio = audioEl;
		this.isPlaying = false;
		// MIC stuff
		this.stream = null;
		this.analyserNode = null;
		this.data = [];
		this.dataWave = [];
		this.size = 2048;
		this.counter = 0;
		this.setup();
	}

	isAudioContextSupported() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if (window.AudioContext) {
			return true;
		} else {
			return false;
		}
	}

	setup() {
		console.log('audio setup');
		if (this.isAudioContextSupported()) {
			this.audioContext = new AudioContext();
			// Setup audio stuff
			this.update();
		} else {
			alert("this browser doesn't support the Web Audio API. Come on...");
		}
	}

	update(/*url*/) {
		// if (url != null) {
			// if (this.audio == null) {
			// 	this.audio = new Audio();
			// 	this.audio.controls = true;
			// 	this.audio.loop = true;
			// 	this.audio.load();
			// 	this.audio.src = '../assets/audio/needed.mp3';
			// 	document.body.appendChild(this.audio);
			// }
			this.mic = null;
			this.broadcast();
		// }
	}

	broadcast() {
		if (this.source == null) this.source = this.audioContext.createMediaElementSource(this.audio);
		this.analyserNode = this.audioContext.createAnalyser();
		this.analyserNode.fftSize = this.size;
		this.source.connect(this.analyserNode);
		this.analyserNode.connect(this.audioContext.destination);
		this.data = new Uint8Array(this.analyserNode.frequencyBinCount);
		this.dataWave = new Uint8Array(this.analyserNode.frequencyBinCount);
		console.log('broadcast')
	}

	onStream(stream) {
		console.log('onstream');
		this.stream = stream;
		this.mic = this.audioContext.createMediaStreamSource(stream);
		this.analyserNode = this.audioContext.createAnalyser();
		this.analyserNode.fftSize = this.size;
		this.mic.connect(this.analyserNode);
		// two kind of analysis
		this.data = new Uint8Array(this.analyserNode.frequencyBinCount);
		this.dataWave = new Uint8Array(this.analyserNode.frequencyBinCount);
	}

	noStream() {
		alert('problem with mic');
	}

	toggle() {
		if (this.isPlaying) {
			this.audio.pause();
		} else {
			this.audio.play();
		}
		this.isPlaying = !this.isPlaying;
	}

	updateFrequency() {
		this.analyserNode.getByteFrequencyData(this.data);
	}

	updateWave() {
		this.analyserNode.getByteTimeDomainData(this.dataWave);
	}

	reset() {
		if (this.audio != null) {
			this.audio.pause();
			this.audio.currentTime = 0;
			this.isPlaying = false;
		}
	}
}
