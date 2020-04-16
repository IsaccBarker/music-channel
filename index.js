var currentSong;
var audio;
var metroWorker;
var foo = "wow!"
var bpmi = 125 // Beats per minute
var beepLength = 50;
var doMetro = true;
var isPlaying = false;

var Songs = {
	TAS: 0,
	ANGEL: 1,
	FIS: 2,
};

const tasAudio = "https://d2fizz4npx5v6x.cloudfront.net/audio/10083834.mp3";
const angelAudio = "https://d2fizz4npx5v6x.cloudfront.net/audio/10513855.mp3";

const tasBpmi = 125;
const angelBpmi = 12000384073240723984723947932798237493827492387498237;

const playSingleSoundTemplate = "setTimeout(function() { playFor(%MILI%, %FREQ%); %U% }, %SPACE%);"

function playFor(miliseconds, frequency) {
	var context = new AudioContext();
	var o = context.createOscillator();
	o.type = "sine";
	o.connect(context.destination);
	o.frequency.value = frequency;
	o.start();
	setTimeout(function() { o.stop(); }, miliseconds);
}

function constructJsPlayForBar(miliseconds, frequencies, space) {
	var i;
	var playSingleSoundTemplates = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]; // TODO: Fix this unholy junk.

	for (i = 0; i < frequencies.length; i++) {
		playSingleSoundTemplates[i] = playSingleSoundTemplate
			.replace("%MILI%", miliseconds)
			.replace("%FREQ%", frequencies[i])
			.replace("%SPACE%", space);
	}

	for (i = frequencies.length; i >= 0; i--) {
		if (i == frequencies.length) {
			playSingleSoundTemplates[i] = playSingleSoundTemplates[i].replace("%U%", "");
		}

		playSingleSoundTemplates[i] = playSingleSoundTemplates[i].replace("%U%", playSingleSoundTemplates[i+1]);
	}

	return playSingleSoundTemplates[0];
}

function changeTime(amount) {
	realAmount = (((1000 / (bpmi / 60))) * amount) / 1000;
	console.log(realAmount);
	audio.currentTime = audio.currentTime + realAmount;
}

function metronome() {
	// eval(constructJsPlayForBar(50, [200, 200, 200, 500], 250));
	if (isPlaying && doMetro) {
		eval(constructJsPlayForBar(beepLength, [300, 300, 300, 300], (1000 / (bpmi / 60))));
	}
}

function play() {
	if (audio != null) {
		audio.remove();
	}

	if (currentSong == Songs.TAS) {
		bpmi = tasBpmi;
		doMetro = true;
		playSound(tasAudio);
	} else if (currentSong == Songs.ANGEL) {
		bpmi = angelAudio;
		doMetro = false;
		alert("WARNING: This metronome cannot play. I was unable to find the BPM. If you are Dr. Jackson, please contact me.");
		playSound(angelAudio);
	} else if (currentSong == Songs.FIS) {
		alert("ERROR: This song cannot play. I was unable to get the audio recording from the HTML. If you are Dr. Jackson, please contact me.");
		return;
	}
}

function pause() {
	if (audio != null) {
		isPlaying = false;
		audio.pause();
	}
}

function resume() {
	if (audio != null && isPlaying == false) {
		isPlaying = true;
		audio.play();
	}
}

function playSound(url){
	console.log(url)
	isPlaying = true;

	audio = document.createElement('audio');
	// audio.style.display = "none";
	audio.src = url;
	audio.autoplay = true;
	audio.onended = function(){
		isPlaying = false;
		audio.remove(); // Remove when played.
	};
	
	document.body.appendChild(audio);
}

function startMetroWorker() {
	setInterval(metronome, (1000 / (bpmi / 60)));
}

function killMetroWorker() {
	clearInterval();
}

startMetroWorker();
