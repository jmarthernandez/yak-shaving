const fs = require("fs");
const got = require("got");
const jsdom = require("jsdom");
const { Promise } = require("bluebird");
const { JSDOM } = jsdom;

(async function () {
  ////Pulled from https://historico.conaliteg.gob.mx/ using script below
  ////pasted into chrome console
  //
  // let hrefs = [];
  //
  // for (let i = 1; i <= 6; i++) {
  //   mostrar_libros(2014, i);
  //
  //   const bookPages = Array.from(window.document.querySelectorAll("a"))
  //     .filter((e) => e.getAttribute("href").includes("H2014"))
  //     .map((e) => `${window.location.origin}/${e.getAttribute("href")}`);
  //
  //   hrefs = hrefs.concat(bookPages);
  // }
  //
  // console.log([...new Set(hrefs)]);


  // H2014 - 2014 edition of books
  // P1,2,3,4,5,6 - what grade
  // NNN - subject(ESA - español, CNA - ciencias naturales, etc)
  const bookUrls = [
    "https://historico.conaliteg.gob.mx/H2014P1CAM.htm",
    "https://historico.conaliteg.gob.mx/H2014P1ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P1LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P1DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P1ENA.htm",
    "https://historico.conaliteg.gob.mx/H2014P1FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P1EAM.htm",
    "https://historico.conaliteg.gob.mx/H2014P1DMM.htm",
    "https://historico.conaliteg.gob.mx/H2014P1ESM.htm",
    "https://historico.conaliteg.gob.mx/H2014P2ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P2LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P2DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P2ENA.htm",
    "https://historico.conaliteg.gob.mx/H2014P2FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P2EAM.htm",
    "https://historico.conaliteg.gob.mx/H2014P2DMM.htm",
    "https://historico.conaliteg.gob.mx/H2014P2ESM.htm",
    "https://historico.conaliteg.gob.mx/H2014P3ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3CNA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3EAA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3AGS.htm",
    "https://historico.conaliteg.gob.mx/H2014P3BCN.htm",
    "https://historico.conaliteg.gob.mx/H2014P3BCS.htm",
    "https://historico.conaliteg.gob.mx/H2014P3CAM.htm",
    "https://historico.conaliteg.gob.mx/H2014P3CHH.htm",
    "https://historico.conaliteg.gob.mx/H2014P3CHP.htm",
    "https://historico.conaliteg.gob.mx/H2014P3COA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3COL.htm",
    "https://historico.conaliteg.gob.mx/H2014P3CDM.htm",
    "https://historico.conaliteg.gob.mx/H2014P3DUR.htm",
    "https://historico.conaliteg.gob.mx/H2014P3GRO.htm",
    "https://historico.conaliteg.gob.mx/H2014P3GTO.htm",
    "https://historico.conaliteg.gob.mx/H2014P3HID.htm",
    "https://historico.conaliteg.gob.mx/H2014P3JAL.htm",
    "https://historico.conaliteg.gob.mx/H2014P3MEX.htm",
    "https://historico.conaliteg.gob.mx/H2014P3MIC.htm",
    "https://historico.conaliteg.gob.mx/H2014P3MOR.htm",
    "https://historico.conaliteg.gob.mx/H2014P3NAY.htm",
    "https://historico.conaliteg.gob.mx/H2014P3NLE.htm",
    "https://historico.conaliteg.gob.mx/H2014P3OAX.htm",
    "https://historico.conaliteg.gob.mx/H2014P3PUE.htm",
    "https://historico.conaliteg.gob.mx/H2014P3QRO.htm",
    "https://historico.conaliteg.gob.mx/H2014P3QUE.htm",
    "https://historico.conaliteg.gob.mx/H2014P3SIN.htm",
    "https://historico.conaliteg.gob.mx/H2014P3SLP.htm",
    "https://historico.conaliteg.gob.mx/H2014P3SON.htm",
    "https://historico.conaliteg.gob.mx/H2014P3TAB.htm",
    "https://historico.conaliteg.gob.mx/H2014P3TAM.htm",
    "https://historico.conaliteg.gob.mx/H2014P3TLA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3VER.htm",
    "https://historico.conaliteg.gob.mx/H2014P3YUC.htm",
    "https://historico.conaliteg.gob.mx/H2014P3ZAC.htm",
    "https://historico.conaliteg.gob.mx/H2014P3DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P3DMM.htm",
    "https://historico.conaliteg.gob.mx/H2014P4ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4CNA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4AMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4GEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4HIA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4CCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4EAA.htm",
    "https://historico.conaliteg.gob.mx/H2014P4DMM.htm",
    "https://historico.conaliteg.gob.mx/H2014P5ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5CNA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5AGA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5GEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5HIA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5EAA.htm",
    "https://historico.conaliteg.gob.mx/H2014P5DMM.htm",
    "https://historico.conaliteg.gob.mx/H2014P6ESA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6LEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6DMA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6CNA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6GEA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6HIA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6FCA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6EAA.htm",
    "https://historico.conaliteg.gob.mx/H2014P6DMM.htm",
  ];

  // contains the the book slug and the number of pages
  // we need to know number of pages so we can generate
  // the urls for the book page jpgs. window.ag_clave is
  // the slug and window.ag_pages is number of pages
  let metadata = [];

  await Promise.map(
    bookUrls,
    function (bookUrl) {
      return got(bookUrl, {
        https: { rejectUnauthorized: false },
      })
        .then(async ({ body }) => {
          const dom = new JSDOM(body, {
            runScripts: "dangerously",
          });
          metadata.push({
            pages: dom.window.ag_pages,
            dir: dom.window.ag_clave,
          });
          return metadata;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    { concurrency: 20 }
  );
  fs.writeFileSync("metadata.json", JSON.stringify(metadata, null, 2));
})();
