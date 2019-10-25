const PatchBay = require("./src/pb-live.js");
const HydraSynth = require("hydra-synth");
const Editor = require("./src/editor.js");
const loop = require("raf-loop");
const P5 = require("./src/p5-wrapper.js");
const Gallery = require("./src/gallery.js");

function init() {
  window.pb = pb;
  window.P5 = P5;

  var canvas = document.getElementById("hydra-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  var pb = new PatchBay();
  var hydra = new HydraSynth({ pb: pb, canvas: canvas, autoLoop: false });
  var editor = new Editor(hydra);

  var handleDataAvailable = recordedChunks => event => {
       if (event.data.size > 0) {
           recordedChunks.push(event.data);
           download(recordedChunks);
       }
   }

   function download(recordedChunks) {
       var blob = new Blob(recordedChunks, {
           type: "video/webm"
       });
       var url = URL.createObjectURL(blob);
       var a = document.createElement("a");
       document.body.appendChild(a);
       a.style = "display: none";
       a.href = url;
       a.download = "test.webm";
       a.click();
       window.URL.revokeObjectURL(url);
   }

   window.record = (x) => {
       var canvas = document.querySelector("canvas");

       var stream = canvas.captureStream(60);
       var recordedChunks = [];

       var options = { mimeType: "video/webm; codecs=vp9" };
       mediaRecorder = new MediaRecorder(stream);

       mediaRecorder.ondataavailable = handleDataAvailable(recordedChunks);
       mediaRecorder.start();
       setTimeout(event => {
           mediaRecorder.stop();
       }, x * 1000);
   }

  Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }

  window.hush = () => {
    solid().out();
    solid().out(o1);
    solid().out(o2);
    solid().out(o3);
    render(o0);
  };

    window._vid = {};
    window._url= {};
    window.vid = (url, key) => {
        if(!window._vid[key]) {
            _vid = document.createElement('video');
            _vid.autoplay = true;
            _vid.loop = true;
            _vid.crossOrigin = 'anonymous';
            setTimeout(() => {_vid.muted = true}, 100);
            window._vid[key] = _vid;
        }
        if (window._url[key] != url) {
            window._url[key] = url;
            __vid = window._vid[key]
            __vid.src= url;
            __vid.play();
        }
        return window._vid[key];
    }

  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: "iclc"
  });

  var engine = loop(function(dt) {
    hydra.tick(dt);
  }).start();
}

window.onload = init;
