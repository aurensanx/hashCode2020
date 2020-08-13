const _ = require("lodash");
const {headData, bodyData, writeFile} = require("./utils");

// preproessing data specific problem
const [R, C, L, H] = headData.split(" ").map(h => parseInt(h));
const data = bodyData.map(d => d.split(""));
const N = 10000000;

// solution
// "str1,str2,str3,str4".match(/T/g) || []).length

const getPossibleShapes = n => {
  const possibleShapes = [];
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (i * j <= n) {
        possibleShapes.push([i, j]);
      } else {
        break;
      }
    }
  }
  return possibleShapes;
};

// FIXME ugly solution for H greater than C or R
const POSSIBLE_SHAPES = getPossibleShapes(Math.min(H, C, R));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let numberOfSlices = 0;
let coordinatesOfSlices = [];


[...Array(N)].map(() => {


  // const data = _.cloneDeep(constData);

  // generate random values
  // shape of slice
  const shape = POSSIBLE_SHAPES[getRandomInt(0, POSSIBLE_SHAPES.length - 1)];
  // const shape = POSSIBLE_SHAPES[1];

  // random row
  const r = getRandomInt(0, Math.max(R - 1 - shape[0], 0));
  // random column
  const c = getRandomInt(0, Math.max(C - 1 - shape[1], 0));


  const checkNumberOfLetter = letter => [...Array(shape[0])].map((v, i) => {
    return _.countBy(data[r + i].slice(c, c + shape[1]), l => l === letter).true || 0;
  }).reduce((a, b) => {
    return a + b;
  });

  // update used cells to 1
  if (checkNumberOfLetter('T') >= L && checkNumberOfLetter('M') >= L && checkNumberOfLetter(1) === 0) {
    [...Array(shape[0])].forEach((v, row) => {
      [...Array(shape[1])].forEach((v, column) => {
        data[r + row][c + column] = 1;
      })
    });

    // update results
    numberOfSlices++;
    coordinatesOfSlices += [r, c, r + shape[0] - 1, c + shape[1] - 1].join(" ") + "\n";
  }

});


// escribir respuesta
writeFile(numberOfSlices + "\n" + coordinatesOfSlices);
