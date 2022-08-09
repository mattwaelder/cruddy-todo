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
  //iterating through storage
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err)
    } else {
      let todoArray = [];
      files.forEach((file) => {
        let uId = file.slice(0, 5);
        todoArray.push({id: uId, text: uId});
      })
      callback(null, todoArray);
    }
  })
};

//Todo.readOne(req.params.id, (err, todo) => {}
exports.readOne = (id, callback) => {
  let todoPath = path.join(exports.dataDir, `${id}.txt`)

  fs.readFile(todoPath, 'utf8', (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, {id: id, text: data})
    }
  })
};

//Todo.update(req.params.id, req.body.todoText, (err, todo) => {}
exports.update = (id, text, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`)

  fs.readFile(filePath, (err, data) => {
    if(err) {
      callback(err);
    } else {
      //write file of id:id with new text
      fs.writeFile(filePath, text, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text})
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  let filePath = path.join(exports.dataDir, `${id}.txt`)

  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(filePath, (err, data) => {
        if (err) {
          callback(err)
        } else {
          callback(null, {})
        }
      })
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
