const maxiAudio = new maximJs.maxiAudio();
const myWave = new maximJs.maxiOsc();  // oscillator
const myWave2 = new maximJs.maxiOsc();  // oscillator

maxiAudio.init();
maxiAudio.play = function() {
  // the audio produced moves the speaker in a sinewave back and forth
  // pushing air out with -1 to 1 amplitude.
  // The volume can be decreased by multiplying this by less than one.
  // This value makes the speaker displace 1/8th the air, becoming quieter.
  this.output = myWave.sinewave(200 * myWave2.sinewave(0.2)) * 0.125;
  // We can only hear sounds from 20Hz - 20,000Hz (20Hz = 20 cycles per second).
  // Multiplying myWave2 allows us to hear the results.
};
