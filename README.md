# devolve
Document Evolution Visualisation

# About

Did you write your latest conference submission using a git repository? And would you like to see how this paper evolved over time? Then you're in luck!

This little script does the following:
  - go through all commits in one branch of your repository
  - typeset each version of your document to PDF
  - create a screen shot of it
  - group all screen shots in an interactive web page as a 'video' of how the document evolved


# Screen shots

![Screen shot 1](https://raw.githubusercontent.com/bvdelft/devolve/screenshots/shot1.png)
![Screen shot 2](https://raw.githubusercontent.com/bvdelft/devolve/screenshots/shot2.png)

# Instructions

Configure the settings in `devolve.sh`. The hardest part is getting the screen shot dimensions right, so you probably want to use the `onlyone` setting until you find what works for you.

Next, run `./devolve.sh`. Afterwards, a project folder is created containing
  - all generated screen shots
  - a web page as an interactive interface to this 'video'

# Known Bugs

  - Web page very slow under Opera. Possible fix (which might be good anyway) include:
    - making not shown screen shots truly hidden, rather than see-through
    - have a thread pool of requests for screen shots, having e.g. max 10 requests open at a time

# Next Features

  - video of screen shots (not on web page)
