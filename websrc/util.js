function wndsize() {
  var w = 0; var h = 0;
  if (!window.innerWidth) { // IE
    if (!(document.documentElement.clientWidth == 0)) { // strict mode
      w = document.documentElement.clientWidth;h = document.documentElement.clientHeight;
    } else { // quirks mode
      w = document.body.clientWidth;h = document.body.clientHeight;
    }
  } else { // non IE
    w = window.innerWidth;
    h = window.innerHeight;
  }
  return {width:w,height:h};
}


function readJSONFile(path, cb) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", path);
  rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          cb(JSON.parse(allText));
        }
       }
    };
  rawFile.send(null);
}