# yak-shaving
I was practicing Spanish but ended up in imagemagick.  All I wanted
was something a little challenging to read but ended up writing a
a node script to fetch pictures from Mexican textbooks from https://historico.conaliteg.gob.mx
and bundle them into a pdf using imagemagick

There are tons of textbooks for different reading levels for those
wanting to practice their Spanish.  It is also fun to learn some 
history from another country's perspective

## Y tho
While it's cool to have open access to educational materials,
it isn't so fun to use on their website.  For example, this [textbook](https://historico.conaliteg.gob.mx/H2014P5HIA.htm)
has a ton of awesome material but it is displayed using a turn.js.
It looks cool but is unpleasant to use and has issue with zooming
in on text and not reseting back to the original viewport.

Also each page is served as a jpg so each book is up of hundreds
of individual images.  It is hard to share that with people.

Mostly, it was fun to reverse engineer how their textbooks were categorized

## Downloading Files
If you find a book and want to use this script it will be helpful to understand
how the urls are structured.

The meat url shared earlier, `https://historico.conaliteg.gob.mx/H2014P5HIA.htm`,
is in the last part `H2014P5HIA`.

The three sections are:
- `H2014` means it is from the 2014 school year
- `P5` means it is for 5th grade
- `HIA` means it is for history class

If you find a book you like, take the slug from the url(`H2014P5HIA`) and pass it
into the following script(case doesn't matter)

```node downloadImages.js H2014P5HIA```

This will only download that textbook's jpgs.  Then run

```./toPdf.sh```

to generate a shareable, printable pdf.

## Filter Arguments
If you decide you want to download more than one file you can pass in a filter
argument to download all textbooks that match.

```node downloadImages.js p5```

This will download all textbooks with a slug that matches all fifth grade
textbooks.

Additionally, you can prefix `not_` to a filter and it will *not* download
files that match that string.

```node downloadImages.js p5 not_dmm```

This will download textbooks for fifth graders but will skip math textbooks(DMM 
is the abbreviation for math).

Not passing arguments will download all files.  This takes a long time as their
are 86 textbooks with 150+ pages each or about 14000 jpgs.

```node downloadImages.js```

## Metadata
https://github.com/jmarthernandez/yak-shaving/blob/master/metadata.json

Metadata was scraped from their website using code in `getMetadata.json`

## Useful Filters

`p1,p2,p3,p4,p5,p6` can be used to select by a grade level

The following are some subjects you can use as filters in the CLI

- `DMM` Desafíos matemáticos
- `CNA` Ciencias Naturales
- `GEA` Geografía
- `HIA` Historia
- `FCA` Formación Cívica y Ética
