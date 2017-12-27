(function () {
  var video = document.getElementById("video");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext('2d');
  var vendorURL = window.URL || window.webkitURL;
  navigator.getMedia =  navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
  navigator.getMedia({
    video: true,
    audio: false
  }, function (stream) {
    video.src = vendorURL.createObjectURL(stream);
    video.play();
  }, function (error) {
    // Error. Sorry but there was an error. Please reload and try again or try again later.
  });

  video.addEventListener('play', function () {
    draw(this, context);
  }, false);

  function setDimensions () {
    var W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (W / H > video.videoWidth / video.videoHeight) {
      // screen is wider than video
      canvas.height = H;
      canvas.width = H / video.videoHeight * video.videoWidth;
    } else {
      // screen is higher than video
      canvas.width = W;
      canvas.height = W / video.videoWidth * video.videoHeight;
    }
    if (canvas.width * canvas.height == 0) {
      canvas.height = H;
      canvas.width = W;
    }
  }

  function getIndex(x, y, color) {
    var pixelIndex = canvas.width * y + x;
    if (color == 'red') {
      return pixelIndex  * 4;
    } else if (color == 'green') {
      return pixelIndex  * 4 + 1;
    } else if (color == 'blue') {
      return pixelIndex  * 4 + 2;
    } else if (color == 'alpha') {
      return pixelIndex  * 4 + 3;
    }
  }

  function draw (video, context) {
    setDimensions();
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // context.beginPath();
    // context.arc(canvas.width/2,canvas.height/2,55,0,2*Math.PI);
    // context.strokeStyle = "#ff2020";
    // context.lineWidth = 10;
    // context.stroke();
    var image = context.getImageData(0,0,canvas.width,canvas.height);
    var data = image.data;
    for (var x = 0; x < canvas.width; x = x + 1) {
      for (var y = 0; y < canvas.height; y = y + 1) {
        if (data[getIndex(x, y, "green")] + data[getIndex(x, y, "blue")] + data[getIndex(x, y, "red")] > 300){
          data[getIndex(x, y, "green")] = 200;
          data[getIndex(x, y, "blue")] = 200;
          data[getIndex(x, y, "red")] = 200;
        } else {
          data[getIndex(x, y, "green")] = 100;
          data[getIndex(x, y, "blue")] = 100;
          data[getIndex(x, y, "red")] = 100;
        }

        // var brightness = (data[getIndex(x, y, "green")] + data[getIndex(x, y, "blue")] + data[getIndex(x, y, "red")]) / 3;
        // data[getIndex(x, y, "green")] = brightness;
        // data[getIndex(x, y, "blue")] = brightness;
        // data[getIndex(x, y, "red")] = brightness;
      }
    }
    image.data = data;
    context.putImageData(image, 0, 0);
    setTimeout(draw, 10, video, context);
  }
})();
