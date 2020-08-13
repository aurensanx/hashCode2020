const _ = require("lodash");
const {headData, bodyData, writeFile} = require("./utils");

const tail = ([first, second, ...rest]) => rest;
const second = ([first, second]) => second;

const removeFunction = (array1, array2) => _.filter(array1, n => array2.indexOf(n) === -1);


// esto me costó la vida
const getKeys = (tagMap, tagList) => {
  const result = [];
  _.forOwn(tagMap, (value, key) => {
    if (tagList.indexOf(value) > -1) {
      result.push(parseInt(key));
    }
  });
  return result;
};

// preprocessing data specific problem
// const [N] = headData.split(" ").map(h => parseInt(h));
const data = bodyData.map((d, index) => {
  return {
    orientation: d[0],
    position: index,
    numberOfTags: parseInt(second(d.split(" "))),
    tags: tail(d.split(" ")),
  }
});


// get total tags
const totalTags = [];
for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i].tags.length; j++) {
    let tag = data[i].tags[j];
    totalTags.push(tag);
  }
}


const uniqTags = _.uniqBy(totalTags);
const tagMap = {};

for (let i = 0; i < uniqTags.length; i++) {
  tagMap[i] = uniqTags[i];
}


console.log(data.length);
// const finalData = data.map((d, i) => ({...d, tags: () => {
//   console.log(i);
//   return getKeys(tagMap, d.tags);
//   }}));
const horizontalPhotos = _.filter(data, ['orientation', 'H']);

// FIXME manera mejor de agrupar verticalPhotos
let verticalPhotos = _.filter(data, ['orientation', 'V']);
let groupedVerticalPhoto = [];
for (let i = 0; i < verticalPhotos.length - 1; i++) {
  const tags = [...verticalPhotos[i].tags, ...verticalPhotos[i + 1].tags];
  groupedVerticalPhoto.push({
    position: verticalPhotos[i].position + " " + verticalPhotos[i + 1].position,
    tags: _.uniqBy(tags),
    // numberOfTags: _.uniqBy(tags).length,
  });
  i++;
}
let finalPhotos = horizontalPhotos.concat(groupedVerticalPhoto);

console.log(finalPhotos.length);

let slideshows = "";
let slideshowsTotal = "";
let score = 0;

// finalPhotos = _.orderBy(finalPhotos, p => -p.numberOfTags);

for (let j = 0; j < finalPhotos.length - 1; j++) {

  let currentIntersection = _.intersection(finalPhotos[j].tags, finalPhotos[j + 1].tags);
  let currentInFirst = _.difference(finalPhotos[j].tags, finalPhotos[j + 1].tags);
  let currentInSecond = _.difference(finalPhotos[j + 1].tags, finalPhotos[j].tags);
  let currentScore = Math.min(currentIntersection.length, currentInFirst.length, currentInSecond.length);

  console.log(j);

  for (let i = j + 1; i < finalPhotos.length; i++) {
    let intersection = 0;
    let inFirst = 0;
    let inSecond = finalPhotos[i].tags.length;
    // let secondArray = [...finalPhotos[i].tags];
    // console.log("firstArray: " + finalPhotos[j].tags);
    // console.log("secondArray: " + secondArray);
    _.forEach(finalPhotos[j].tags, tag => {
      let index = finalPhotos[i].tags.indexOf(tag);
      if (index > -1) {
        intersection++;
        inSecond--;
      } else {
        inFirst++;
      }
    });

    // console.log("intersection: " + intersection);
    // console.log("inFirst: " + inFirst);
    // console.log("inSecond: " + secondArray);

    let score = Math.min(intersection, inFirst, inSecond);

    if (score > currentScore) {
      let aux = finalPhotos[j + 1];
      finalPhotos[j + 1] = finalPhotos[i];
      finalPhotos[i] = aux;
    }
  }
}

slideshows += finalPhotos[0].position + "\n";
slideshowsTotal++;
for (let i = 1; i < finalPhotos.length; i++) {
  slideshows += finalPhotos[i].position + "\n";
  slideshowsTotal++;
  let intersection = _.intersection(finalPhotos[i - 1].tags, finalPhotos[i].tags);
  let inFirstNotInSecond = removeFunction(finalPhotos[i - 1].tags, finalPhotos[i].tags);
  let inSecondNotInFirst = removeFunction(finalPhotos[i].tags, finalPhotos[i - 1].tags);

  score += Math.min(intersection.length, inFirstNotInSecond.length, inSecondNotInFirst.length);
}

console.log(score);


writeFile(slideshowsTotal + "\n" + slideshows);