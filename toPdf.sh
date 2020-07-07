#!/bin/bash 
for d in H2014*;
do
    if [ -f "$d/done" ]; then
        if [ ! -f "$d/$d.pdf" ]; then
            echo "converting images to $d/$d.pdf"
            cd "$d" && convert *.jpg -sampling-factor 4:2:0 -strip -quality 75 -interlace JPEG -colorspace RGB "$d".pdf
            cd ../
        else
            echo "$d/$d.pdf already exists"
        fi
    else 
        echo "$d/done does not exist. Skipping"
    fi
    
done

cp -nr ./H2014*/*.pdf ~/Library/Mobile\ Documents/com~apple~CloudDocs/Books/