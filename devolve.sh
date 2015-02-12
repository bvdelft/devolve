#!/bin/bash

### START OF SETTINGS ###

#
# Easy settings:
#  - repo   : path to repository
#  - branch : branch to create document visualisation of
#  - build  : build command
#  - pdf    : name of generated pdf, without extension
#
repo="/scratch/ddyp/csf2015"
branch="master"
build="make"
pdf="main"

#
# More tricky settings: depends on resize factor too.. now works only for A4.
# Settings are very low-res, otherwise not feasible as web page animation.
#  - pagew/pageh : Width / height of individual page after resizing
#  - nrows/ncols : Number of rows / columns in generated picture
#                  Keep in mind that older versions might be longer than the
#                  latest version!
#  - onlyone     : Set to "true" to only generate the visualisation of the last
#                  commit, to see if the settings work as expected.
#
pagew=179
pageh=253
nrows=3
ncols=6
onlyone="false"

#
# All done? Call the script as "./devolve.sh".
#

### END OF SETTINGS ###

#
# Set up directories
#
mkdir -p tmp
mkdir -p gifs
mkdir -p website
devolvedir=`pwd`

#
# Compute dimensions of final picture
#
finalw=$(($ncols*$pagew))
finalh=$(($nrows*$pageh))
dimensions=$finalw"x"$finalh

#
# Go to latest commit:
#
cd $repo
git checkout $branch

#
# Gather meta-information to be used on web page
#
git log --date=local \
  --pretty=format:'{%n "commit": "%H",%n "author": "%an",%n "email": "%ae",%n "date": "%ad",%n "message": "%f"%n},' $@ | \
  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
  perl -pe 's/},]/}]/' > $devolvedir/website/metainfo.json

#
# History of all commit hashes.
#
git log --pretty=format:'%H' > $devolvedir/tmp/allcommits

#
# Function combining individual pictures from convert pdf.
#
function combine {
  cd $devolvedir/tmp/
	# Generating call combining groups of /ncols/ pages into rows.
  for r in $(seq 0 $(($nrows-1))); do 
		cmd="convert "
		for c in $(seq 0 $(($ncols-1))); do
			cmd=$cmd"pdf-"$(($r*$ncols + $c))".png "
		done
		cmd=$cmd" +append row"$r".png"
		{ `$cmd` 
		} 2> /dev/null
  done
	# Generating call combining /nrows/ pictures into one figure.
  cmd="convert "
  for r in $(seq 0 $(($nrows-1))); do 
    cmd=$cmd"row"$r".png "
  done
  cmd=$cmd" -append all.png"
  { `$cmd` 
  } 2> /dev/null
  cd $repo
}

#
# Some user feedback.
#
ncommits=`grep -c '' $devolvedir/tmp/allcommits`
n=0
echo "Going through $ncommits commits (in reversed order)"

#
# Read commits one by one, make pdf, convert to pictures, combine pictures,
# resize result and remove temporary files.
#
while read comhash; do
  # User feedback:
  n=$(($n+1))
  echo "$n / $ncommits"
	# Go to next commit, build pdf
	git checkout $comhash
	{ `$build` 
  } 2> /dev/null > /dev/null
	# Convert pdf to png-s
  convert $pdf.pdf $devolvedir/tmp/pdf.png
	# Combine png-s into single png
	combine
	# Convert png to resized, lower res gif.
  convert $devolvedir/tmp/all.png -resize 30% -flatten -type Grayscale -depth 3 -extent $dimensions $devolvedir/gifs/$comhash.gif
	# Remove temp files.
  rm $devolvedir/tmp/*.png
	if [ $onlyone = "true" ];
	then
	  break
	fi
done < $devolvedir/tmp/allcommits

#
# Reset repository.
#
cd $repo
git checkout $branch

#
# User feedback.
#
echo "Done! Generated pictures can be found in gifs/ folder."