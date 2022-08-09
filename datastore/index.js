const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// ~ called by server ~
//Todo.create(req.body.todoText, (err, newTodo) => {}
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, newId) => {
    //data is new unique id
    //writeFile(path, contents, errCB)
    let newPath = path.join(exports.dataDir, `${newId}.txt`);
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        console.log(err)
      } else {
        callback(null, {id: newId, text})
      }
    })
  })
};

// Todo.readAll((err, todos) => {}
//i think we want an array of these
//file looks like { id: '00001', text: 'buy chocolate' }
exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  //iterating through storage
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err)
    } else {
      let todoArray = [];
      files.forEach((file) => {
        let uId = file.slice(0, 5);
        todoArray.push({id: uId, text: uId});//instead of pushing entire file figure out to push text only
      })
      callback(null, todoArray);
    }
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
