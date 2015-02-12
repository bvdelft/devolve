
function repaint() {
  var w = Math.min(wndsize().width, SETTINGS.imgwidth) - (SETTINGS.marginx * 2);
  var h = Math.min(wndsize().height, SETTINGS.imgheight) - (SETTINGS.marginy * 2);
  var wByH = SETTINGS.imgwidth * (h / SETTINGS.imgheight);
  var optimalW = Math.min(w, wByH);
  var imgs = document.getElementsByClassName("sshot");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.width = optimalW + 'px';
    imgs[i].style.marginLeft = "-" + (optimalW / 2) + "px";
    imgs[i].style.top = (SETTINGS.marginx * 2) + 'px';
  }
}

function move(from, to, time, cb) {
  var start = new Date;
  var duration = time;
  var fromEl = from;
  var toEl = to;
  var out = setInterval(function() {
      var timePassed = new Date - start;
      var progress = timePassed / duration;
      if (progress > 1) {
          progress = 1;
      }
      toEl.style.opacity = progress;
      if (progress == 1) {
        fromEl.style.opacity = 0;
        clearInterval(out);
        allMove.splice(allMove.indexOf(out), 1);
        cb();
      }
    }, 10);
  allMove.push(out);
}

window.onresize = repaint;
window.onload = init;


var toLoad = 0;
var loaded = 0;
var sshots = [];
var sshotwrap;
var mySlider;
var allMove = []; // unused?
var allData;

function stopAllMove() {
  for (var i = 0; i < allMove.length; i++) {
    clearInterval(allMove[i]);
  }
  allMove = [];
}

function showMetaInfo(i) {
  var el = allData[i];
  document.getElementById('commit').innerHTML = 
    "<a href='https://bitbucket.org/bvd/dacodyp/commits/"+el.commit+"' target='_blank'>" + el.commit.substr(0,8) + "</a>";
  document.getElementById('name').innerHTML = el.author;
  document.getElementById('message').innerHTML = el.message.replace(/-/g,' ');
  document.getElementById('date').innerHTML = el.date;
  document.getElementById('banner').style.opacity = 1;
}

function hideAll() {
  for (var i = 0; i < sshots.length; i++) {
    sshots[i].style.opacity = 0;
  }
}

var current;
function doneLoading() {
  repaint();
  mySlider = new dhtmlXSlider({
        parent:  "sliderObj",
        step:  1,
        min:  0,
        max:  toLoad-1,
        value:  toLoad-1
    });
  mySlider.attachEvent("onChange", function(value){
      stopAllMove();
      hideAll();
      value = value + 1;
      sshots[toLoad-value].style.opacity = 1;
     showMetaInfo(toLoad-value);
    });
  document.getElementById('slider').style.opacity = '1';
  play();
}
function play() {
  current = 0;
  stopAllMove();
  hideAll();
  iterate();
}
function iterate() {
  current++;
  if (current < toLoad) {
    move(sshots[toLoad-current], sshots[toLoad-current-1], 200, iterate);
    mySlider.setValue(current);
    showMetaInfo(toLoad-current-1);
  }
}

function loadImage(data) {
  var img = document.createElement('img');
  img.src = "gif/" + data['commit'] + ".gif";
  img.setAttribute('class','sshot');
  img.onload = function () {
      loaded++;
      if (toLoad == loaded) {
        doneLoading();
        loader.hide();
        document.getElementById('loading').innerHTML = '';
      } else {
        loader.setProgress(loaded);
      }
  }
  sshotwrap.insertBefore(img, sshotwrap.firstChild);
  return img;
}


function getMetaData() {
  readJSONFile("metainfo.json", function (commitInfo) {
      allData = commitInfo;
      toLoad = allData.length;
      loader.setMax(toLoad);
      for (var i = 0; i < toLoad; i++) {
        // Can be detached to different thread earlier?
        sshots.push(loadImage(allData[i]));
      }      
    });
}

function init() {
  loader = new Loader(document.getElementById('loading'));
  sshotwrap = document.getElementById('sshotwrap');
  getMetaData();
}