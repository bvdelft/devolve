#!/bin/bash

# Settings:
repo="/scratch/dacodyp/csf2015"
branch="master"
build="make clean; make"
pdf="main"
# tricky: depends on resize factor too.. now works only for A4.
pagew=179
pageh=253
nrows=3
ncols=6


# Set up directories
mkdir -p tmp
mkdir -p gifs
mkdir -p website

devolvedir=`pwd`

# Go to latest commit:
cd $repo
git checkout $branch

# Gather meta-information used on web page
git log --date=local \
  --pretty=format:'{%n "commit": "%H",%n "author": "%an",%n "email": "%ae",%n "date": "%ad",%n "message": "%f"%n},' $@ | \
  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
  perl -pe 's/},]/}]/' > $devolvedir/website/metainfo.json
  
# History of all commit hashes
git log --pretty=format:'%H' > $devolvedir/tmp/allcommits

function combine {
  cd $devolvedir/tmp/
  for r in $(seq 0 $(($nrows-1))); do 
  cmd="convert "
  for c in $(seq 0 $(($ncols-1))); do
    cmd=$cmd$fname"-"$(($r*$ncols + $c))".png "
  done
  cmd=$cmd" +append row"$r".png 2> /dev/null"
  { 
    `$cmd` 
  } 2> /dev/null
  done
  cmd="convert "
  for r in $(seq 0 $(($nrows-1))); do 
    cmd=$cmd"row"$r".png "
  done
  cmd=$cmd" -append all.png 2> /dev/null"
  { 
    `$cmd` 
  } 2> /dev/null
  rm main*.png
  rm line*.png
  cd $repo
}

#
# Compute dimensions of final picture
#
finalw=$(($ncols*$pagew))
finalh=$(($nrows*$pageh))
dimensions=$finalw"x"$finalh
ncommits=`grep -c '' $devolvedir/tmp/allcommits`
n=0
echo "Going through $ncommits commits"
while read comhash; do
  n=$(($n+1))
  echo "$n / $ncommits"
	{ 
	  git checkout $comhash
    `$build` 
  } 2> /dev/null > /dev/null
  convert $pdf.pdf $devolvedir/tmp/pdf.png
  ./combine.sh
  convert $devolvedir/tmp/all.png -resize 30% -flatten -type Grayscale -depth 3 -extent $dimensions $devolvedir/gifs/$comhash.gif
  rm $devolvedir/tmp/*.png
done < $devolvedir/tmp/allcommits