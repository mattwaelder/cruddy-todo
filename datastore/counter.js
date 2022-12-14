const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
      // throw new Error('error reading counter');
    } else {
      callback(err, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//purpose: make new unique id, add unique id to txt file, pass unique id to index.js
exports.getNextUniqueId = (callback) => {
  //saves a file into data with content = to current count

  //1 read current counter
  //readcounter(callback(err, success))
  readCounter((err, curr) => {// read the file
      //writeCounter(count, successCallback(err, success))
      // let nextNum = curr
      if (err) {
        callback(err)
      } else {
        writeCounter(curr+1, (err, uniqId) => {//if you can read the file write a new unique id
          if (err) {
            callback(err)
          } else {
            callback(null, uniqId);//return a call back with zeropadded #
          }
        })
      }
  })
};



// Configuration -- DO NOT MODIFY ///////////`///////////////////////////////////
exports.counterFile = path.join(__dirname, 'counter.txt');
