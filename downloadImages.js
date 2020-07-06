const download = require("image-downloader");
require("https").globalAgent.options.ca = require("ssl-root-cas/latest").create();
const { Promise, promisify } = require("bluebird");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const chalk = require("chalk");
const metadata = require("./metadata.json");
const { existsSync, writeFileSync } = require("fs");

const filterArgs = process.argv.slice(2);

if (filterArgs[0] === "NUKE") {
  console.log("Deleting all books");
  metadata.forEach(({ dir }) => rimraf.sync(`./${dir}`));
  console.log("Boom");
  process.exit(0);
}

console.time("test");
// pages is the number of pages that we can fetch
// reqs will fail if you try to fetch a page that doesn't exist
//
// dir is the the url slug for the book and also what the destination
// directory for the images will be named
//
// window.ag_pages and window.ag_clave on each page is where this
// meta data is pulled from

function showLoadingIndicator(completed, total) {
  let percentage = Math.floor((completed / total) * 100);
  let loadingBar = "=".repeat(percentage / 2) + "-".repeat(50 - percentage / 2);
  console.log(`${percentage}% [${loadingBar}]`);
}

// Very silly query engine.  More yak shaving for fun
// p4 will include all claves that contain p4
// not_p4 will exclude claves that contain p4
// ex) [p4, not_HIA, not_CNA]
// => claves that are p4 but does not include science or history
function predicate(args, str) {
  const not = args.filter((a) => a.substring(0, 4) === "not_");
  const match = args.filter((a) => a.substring(0, 4) !== "not_");

  return (
    match.every((a) => str.includes(a)) &&
    not.every((a) => !str.includes(a.substring(4)))
  );
}

function generateUrl(book, pageNumber) {
  if (pageNumber < 10) {
    return `https://historico.conaliteg.gob.mx/c/${book}/00${pageNumber}.jpg`;
  } else if (pageNumber < 100) {
    return `https://historico.conaliteg.gob.mx/c/${book}/0${pageNumber}.jpg`;
  }
  return `https://historico.conaliteg.gob.mx/c/${book}/${pageNumber}.jpg`;
}

let count = (async function () {
  let books = {};

  console.log(`Starting: Recreating directories and generating request urls`);

  metadata
    .filter(({ dir }) => {
      if (filterArgs.length === 0) {
        return true;
      }
      return predicate(
        filterArgs.map((f) => f.toLowerCase()),
        dir.toLowerCase()
      );
    })
    .forEach(({ dir, pages }) => {
      // if book has already been downloaded don't enqueue it
      if (existsSync(`./${dir}/done`)) {
        console.log(`Already downloaded ${dir}`);
        return;
      }
      rimraf.sync(`./${dir}`);
      mkdirp.sync(`./${dir}`);
      books[dir] = [];
      for (let i = 0; i < pages; i++) {
        const requestUrl = generateUrl(dir, i);

        books[dir].push({
          requestUrl,
          dir,
        });
      }
    });

  console.log(
    `Finished: Recreating directories and generating request urls for ${
      Object.keys(books).length
    } books`
  );
  console.log(
    `Books selected for download:\n${Object.keys(books).join("\n")}\n`
  );

  for (var bookClave in books) {
    const pages = books[bookClave];
    console.log(`Starting: Processing ${bookClave}`);

    let pagesComplete = 0;
    const statusInterval = setInterval(() => {
      showLoadingIndicator(pagesComplete, pages.length);
      console.log(
        chalk.bgGreen(
          `Completed ${pagesComplete} of ${pages.length} pages in ${bookClave}`
        )
      );
    }, 5000);
    await Promise.map(
      //fetch images for each page in the book
      books[bookClave],
      ({ requestUrl, dir }) => {
        return download
          .image(
            (options = {
              url: requestUrl,
              dest: `./${dir}`,
              rejectUnauthorized: false,
            })
          )
          .then((i) => {
            pagesComplete++;
            return i;
          })
          .catch((err) => console.error(err));
      },
      { concurrency: 20 }
    )
      .then(() => {
        clearInterval(statusInterval);
        writeFileSync(`./${bookClave}/done`);
        console.log(`Finished: Processing ${bookClave}`);
      })
      .catch((err) => {
        clearInterval(statusInterval);
        console.error(err);
      });
  }
  console.timeEnd("test");
})();
