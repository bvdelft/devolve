var Loader = function(div) {
    this.div = div;
    this.setMax = function (max) {
        this.max = max;
      };
    this.setProgress = function (val) {
        var p = Math.floor(100*val/this.max);
        this.div.innerHTML = p + "% loaded";
      };
    this.hide = function () {
        this.div.style.display = "none";
      };
  };