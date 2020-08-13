const fs = require("fs");

const fileName = "c_memorable_moments";

// read file
const fileInput = fs.readFileSync('sampledata/in/' + fileName + '.txt', 'utf8');

// write file
const writeFile = dataOutput => fs.writeFile("sampledata/out/" + fileName + ".out", dataOutput, err => {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});

// preprocessing data
// assuming one line of header and the rest of data, with the last line empty
const head = ([first]) => first; // first
const tail = ([first, ...rest]) => rest; // all but first
const init = array => array.slice(0, -1); // all but last
const fileArray = fileInput.split(/\r?\n/);

const headData = head(fileArray);
const bodyData = init(tail(fileArray));


// export useful data
module.exports = {headData, bodyData, writeFile};