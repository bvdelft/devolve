var ShotCollection = function (commitInfo) {
    this.shots = [];
    this.commitInfo = commitInfo;
    
    this.addShot = function (meta, img) {
        for (var i = 0; i < this.commitInfo.length; i++)
          if (this.commitInfo[i].commit == meta.commit)
            this.shots[i] = { meta : meta, img : img };
      };
    
    this.size = function () {
        return this.shots.length;
      };
    
    this.getImg = function (i) {
        return this.shots[this.shots.length - i - 1].img;
      };
    
    this.getMeta = function (i) {
        return this.shots[this.shots.length - i - 1].meta;
      };
  };
