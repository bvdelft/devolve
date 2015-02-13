/**
 * When resizing the window, align screen shots such that they are centered and
 * not larger than the original image file itself.
 **/
window.onresize = repaint;
function repaint() {
  var w = Math.min(wndsize().width, SETTINGS.imgwidth) - (SETTINGS.marginx * 2);
  var h = Math.min(wndsize().height, SETTINGS.imgheight) - (SETTINGS.marginy * 2);
  var wByH = SETTINGS.imgwidth * (h / SETTINGS.imgheight);
  var optimalW = Math.min(w, wByH);
  var imgs = document.getElementsByClassName("sshot");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.width = optimalW + 'px';
    imgs[i].style.marginLeft = "-" + (optimalW / 2) + "px";
    imgs[i].style.top = SETTINGS.marginy + 'px';
  }
}

var animation;
var toLoad = 0;
var loaded = 0;
var sshotwrap;

function doneLoading() {
  
  repaint();
  
  var mySlider = new dhtmlXSlider({
        parent:  "sliderObj",
        step:  1,
        min:  0,
        max:  toLoad-1,
        value:  toLoad-1
    });
  
  mySlider.attachEvent("onChange", function(value){
      animation.jumpTo(value);
    });
  
  animation = new Animation(shotCollection, mySlider,
    new MetaController(shotCollection,
      document.getElementById('commit'),
      document.getElementById('name'),
      document.getElementById('message'),
      document.getElementById('date'),
      document.getElementById('banner')) );
  
  document.getElementById('slider').style.opacity = '1';
  
  play();
}

function play() {
  animation.animate(SETTINGS.playSpeed);
}

function loadImage(data) {
  var img = document.createElement('img');
  img.src = SETTINGS.path + data['commit'] + ".gif";
  img.setAttribute('class','sshot');
  var meta = data;
  img.onload = function () {
      loaded++;
      img.style.display = 'inline';
      shotCollection.addShot(meta, img);
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
      shotCollection = new ShotCollection(commitInfo);
      toLoad = commitInfo.length;
      loader.setMax(toLoad);
      for (var i = 0; i < toLoad; i++) {
        // Can be detached to different thread earlier?
        loadImage(commitInfo[i]);
      }
    });
}

var shotCollection;

window.onload = init;
function init() {
  loader = new Loader(document.getElementById('loading'));
  sshotwrap = document.getElementById('sshotwrap');
  getMetaData();
}
