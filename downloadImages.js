const download = require("image-downloader");
require("https").globalAgent.options.ca = require("ssl-root-cas/latest").create();
const { Promise } = require("bluebird");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
console.time("download");
// pages is the number of pages that we can fetch
// reqs will fail if you try to fetch a page that doesn't exist
//
// dir is the the url slug for the book and also what the destination
// directory for the images will be named
//
// window.ag_pages and window.ag_clave on each page is where this
// meta data is pulled from
export const cuartoGrado = [
  { pages: 162, dir: "H2014P4ESA" },
  { pages: 161, dir: "H2014P4LEA" },
  // {pages: 258, dir: "H2014P4DMA"},
  { pages: 162, dir: "H2014P4CNA" },
  { pages: 130, dir: "H2014P4AMA" },
  { pages: 202, dir: "H2014P4GEA" },
  { pages: 194, dir: "H2014P4HIA" },
  { pages: 66, dir: "H2014P4CCA" },
  { pages: 130, dir: "H2014P4FCA" },
  { pages: 90, dir: "H2014P4EAA" },
  { pages: 338, dir: "H2014P4DMM" },
];

cuartoGrado.forEach(({ dir }) => {
  rimraf.sync(`./${dir}`);
});

cuartoGrado.forEach(({ dir }) => {
  mkdirp.sync(`./${dir}`);
});

function generateUrl(book, pageNumber) {
  if (pageNumber < 10) {
    return `https://historico.conaliteg.gob.mx/c/${book}/00${pageNumber}.jpg`;
  } else if (pageNumber < 100) {
    return `https://historico.conaliteg.gob.mx/c/${book}/0${pageNumber}.jpg`;
  }
  return `https://historico.conaliteg.gob.mx/c/${book}/${pageNumber}.jpg`;
}

let promises = [];

cuartoGrado.forEach(({ pages, dir }) => {
  for (let i = 0; i < pages; i++) {
    const requestUrl = generateUrl(dir, i);

    console.log(`Queueing: ${requestUrl}`);

    promises.push({
      requestUrl,
      dir,
    });
  }
});

Promise.map(
  promises,
  ({ requestUrl, dir }) => {
    console.log(`Downloading: ${requestUrl} to ./${dir}`);

    return download
      .image(
        (options = {
          url: requestUrl,
          dest: `./${dir}`,
          rejectUnauthorized: false,
        })
      )
      .catch((err) => console.error(err));
  },
  { concurrency: 5 }
)
  .then(() => {
    console.log("Completed");
    console.timeEnd("download");
  })
  .catch((err) => {
    console.error(err);
  });
