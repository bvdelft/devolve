var Animation = function (shotCol, slider, meta) {
    this.shotCol = shotCol;
    this.slider = slider;
    this.meta = meta;
    this.current = 0;
   
    /* Start animation from current frame. */ 
    this.animate = function (duration, callback) {
        this.halt();
        this.hideAll();
        this.next = this.current + 1;
        this.target = this.shotCol.size() - 1;
        this.start = new Date;
        this.callback = callback;
        this.duration = duration;
        var self = this;
        this.slider.setValue(this.current);
        this.meta.showInfo(this.current);
        this.shotCol.getImg(this.current).style.opacity = 1;
        this.interval = setInterval( function () { self.step(); }, 10);
      };
    
    this.step = function () {
        var timePassed = new Date - this.start;
        var progress = timePassed / this.duration;
        if (progress > 1) {
            progress = 1;
        }
        this.shotCol.getImg(this.next).style.opacity = progress;
        if (progress == 1) {
          this.shotCol.getImg(this.current).style.opacity = 0;
          this.current = this.next;
          this.slider.setValue(this.current);
          this.meta.showInfo(this.current);
          if (this.current == this.target) {
            clearInterval(this.interval);
            if (typeof this.callback != "undefined")
              this.callback();
            return;
          }
          this.next = this.current + 1;
          this.start = new Date;
        }
      };
    
    this.halt = function () {
        if (typeof this.interval == "undefined")
          return;
        this.shotCol.getImg(this.next).style.opacity = 0;
        this.shotCol.getImg(this.current).style.opacity = 1;
        clearInterval(this.interval);
      };
    
    this.hideAll = function () {
        for (var i = 0; i < this.shotCol.size(); i++) {
          this.shotCol.getImg(i).style.opacity = 0;
        }
      };
    
    this.jumpTo = function (frame) {
        this.halt();
        this.hideAll();
        this.shotCol.getImg(frame).style.opacity = 1;
        this.slider.setValue(frame);
        this.meta.showInfo(frame);
        this.current = frame;
      };
    
  };
