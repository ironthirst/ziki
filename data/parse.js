const fs = require("fs");

const qwertyMapping = {};

fs.readFileSync("./bin/bopomofo.txt", "utf-8")
  .split("\n")
  .map((l) => l.split("\t"))
  .forEach((pair) => {
    if (pair.length !== 2) return;
    const [qwerty, ch] = pair;
    // filter out obscure chars that we do not event have
    // the glyph for
    if (ch.charCodeAt(0) > 50000) return;
    let record = qwertyMapping[qwerty];
    if (record) {
      record.characters.push(ch);
    } else {
      record = {
        characters: [ch],
      };
      qwertyMapping[qwerty] = record;
    }
  });

const bopomofoMapping = {};
fs.readFileSync("./bin/bopomofo2.txt", "utf-8")
  .split("\n")
  .map((l) =>
    l
      .split("\t")
      .filter((c) => c !== "#" && c.length)
      .splice(0, 3)
  )
  .forEach((triplet) => {
    if (!qwertyMapping[triplet[2]]) {
      return;
    }
    qwertyMapping[triplet[2]].bopomofo = triplet[0];
  });

fs.writeFileSync("./bin/cleaned.js", JSON.stringify(qwertyMapping, null, 2));
// console.log(qwertyMapping);
