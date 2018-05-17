const maxiAudio = new maximJs.maxiAudio();
const myWave = new maximJs.maxiOsc();  // oscillator
const myWave2 = new maximJs.maxiOsc();  // oscillator

maxiAudio.init();

// HARMONICS
// harmonics are fundamental wave forms multiplied by an integer
// console.log(maxiAudio);
maxiAudio.play = function() {
  // SAW WAVE
  // a saw wave is a wave form that rises to max immediately and then
  // gradually falls down to min hitting every harmonic step along the way
  // giving it a buzz sound.
  // this.output = myWave.saw(440) * 0.125;

  // SQUARE WAVE
  // a square wave form rises and stays at max for a certain amount of time
  // and then falss down to min for a set amount of time.
  // this makes an odd harmonic, because the wave rises every odd phase.
  // this.output = myWave.square(100) * 0.125;

  // PULSE WAVE
  // a pulse wave varies the time in each cycle that a wave form spends at max and a min.
  // the time spent in each extreme is inversely related. for example,
  // increasing time in the max, decreases time in the min, and vice versa.
  // this causes a phasing out and in of various harmonics.
  //
  // the second argument must be between 0 and 1
  // this determines the difference in time between the max and min.
  // .5 is the same as a square wave (equal time for each max and min phase)
   this.output = myWave.pulse(100, .9) * 0.125;
};
