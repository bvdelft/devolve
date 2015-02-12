var ShotCollection = function () {
    this.shots = [];
    
    this.addShot = function (meta, img) {
        this.shots.push( { meta : meta, img : img } );
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