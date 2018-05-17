var context;
var source, sourceJS;
var analyser;
var audioArray;
var boost = 0;
var url = 'Tessellate.m4a';

// loading web audio API on browsers
try {
  if (typeof AudioContext === 'function') {
    context = new AudioContext();
    context.resume();
  }
}
catch(e) {
  // Web Audio API not supported on the browser
  alert('Web Audio API is not supported on this browser.  Recommend Re-opening in Chrome =)');
}

var request = new XMLHttpRequest();

// getting music data
request.open('GET', url, true);
// placing response in an ArrayBuffer (fixed-length raw binary data)
request.responseType = 'arraybuffer';

// XMLHttpRequest Level 2: ArrayBuffer (binary data)
request.onload = function() {
  // asychronously decodes audio file data contained in arraybuffer from reponse
  context.decodeAudioData(request.response,
    // decoded data in buffer
    function(buffer) {
      if (!buffer) {
        alert('Error decoding file data');
        return;
      }
      // audioNode that allows javascript manipulation of audio (linked to input and output buffer)
      sourceJS = context.createScriptProcessor(2048, 1, 1);
      // add decoded buffer info as input on sourceJS
      sourceJS.buffer = buffer;
      // connect the ScriptProcessor module to the output buffer (destination = soundcard)
      sourceJS.connect(context.destination);

      // create AnalyserNode that exposes audio data, input is outputted unchanged
      analyser = context.createAnalyser();
      // average between the current buffer and the last buffer the analyser processed
      // range from (0 - 1) 0 = no time between the two, 1 = the two buffers will overlap
      // this number smoothes the changes across the AnalyserNode
      analyser.smootherTimeConstant = 0.6;
      // fft = Fast Fourier Transform, fftSize is used to determine the frequency domain
      // can be simply used to create am oscilloscope-stlyle output from audio
      analyser.fftSize = 512;

      // AudioBufferSourceNode that takes input source as ArrayBuffer and converts it to audio
      source = context.createBufferSource();
      source.buffer = buffer;

      // connect all nodes from the audio source (BufferSource) to the destination (soundcard)
      // while passing through the analyser and ScriptProcessor
      source.connect(analyser);
      analyser.connect(sourceJS);
      source.connect(context.destination);

      // creates an AudioProcessingEvent from the ScriptProcessorNode input buffer
      // we will create an array of values based on the analyser frequency data
      // in order to draw the cubes
      sourceJS.onaudioprocess = function(audioEvent) {
        // array with size of AnalyserNode's frequencyBinCount
        // which is the fftSize divided in half
        audioArray = new Uint8Array(analyser.frequencyBinCount);
        // copies current frequency data into the array
        analyser.getByteFrequencyData(audioArray);

        boost = 0;

        for (var i = 0; i < audioArray.length; i++) {
          boost += audioArray[i];
        }

        boost = boost / audioArray.length;
      };

      source.start(0);

      // $(document)
      //   .on('keydown', function(e) {
      //     if (e.keyCode === 80) {
      //       source.start(0);
      //     }
      //   })
      //   .on('keydown', function(e) {
      //     if (e.keyCode === 83) {
      //       source.stop(0);
      //     }
      //   });

    },

    function(error) {
      alert('decoding error ' + error);
    });
  }

  request.onerror = function() {
    alert('buffer XHR error');
  }

  request.send();
