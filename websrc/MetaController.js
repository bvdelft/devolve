var MetaController = function (shotCol, commit, author, message, date, banner) {
    this.shotCol = shotCol;
    this.commit = commit;
    this.author = author;
    this.message = message;
    this.date = date;    
    this.banner = banner;
    
    this.showInfo = function (i) {
        var info = shotCol.getMeta(i);
        this.commit.innerHTML = "<a href='" + SETTINGS.repopath + info.commit +
          "' target='_blank'>" + info.commit.substr(0,8) + "</a>";
        this.author.innerHTML = info.author;
        this.message.innerHTML = info.message.replace(/-/g,' ');
        this.date.innerHTML = info.date;
        this.banner.style.opacity = 1;
      };
  };