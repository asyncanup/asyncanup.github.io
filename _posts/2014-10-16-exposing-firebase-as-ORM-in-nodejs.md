---
layout: post
title: Exposing Firebase data as REST-like ORM store in Node.js
---

A quick and dirty solution for the times when you want to connect to [Firebase](https://www.firebase.com/) from the server, and not directly from the client browser, exposing Firebase data as simple asynchronous calls in Node.js.


## Proposal

Just provide a Firebase URL and a few resource names to a utility module in order to get REST-like access to those resources (think tables) as simple asynchronous calls.


## Example usage

### Initialize the `db` (acting as ORM):

```js
var db = require('./firebase-data')(
  'http://myblog.firebaseio.com',
  [ 'posts', 'comments' ]
);
```

### Use `db.create` to create new objects of provided resource type:

```js
db.create('posts', {
  title: 'Title',
  body: 'Body'
}, function (e, post) {
  var id = post.id;
  console.log('created with id', id);
});
```

### Use `db.read` to read back the full list of objects of a particular resource type:

**Important note**: `read` does not fetch everything all over again from Firebase, it keeps a local copy and responds from that local copy, and keeps itself in sync with Firebase continuously (using Firebase realtime API).

So calling `read` again and again does not incur extra Firebase usage charges. Good thing. But it also means you will get an empty array if you try to `read` before a connection to Firebase has been established.

```js
db.read('posts', function (e, posts) {
  // all posts have unique post.id
  console.log(posts);
});
```

### Use `db.update` to update a particular object:

```js
db.update('posts', post.id, {
  title: 'New title'
}, function (e, post) {
  console.log('updated', post);
});
```

### Use `db.delete` to delete a particular object from database:

```js
db.delete('posts', id, function (e, post) {
  console.log('deleted', post);
});
```


## Why did you even make this?

Because Firebase database model is unusual, interesting and not trivial. It's not obvious how to design an intuitive schema to manage your data in Firebase. This utility takes care of all that for you. It's a simple ORM.


## Alright, now show me the code!

Here is `firebase-data.js` as required above:

```js
var Firebase = require("firebase"),
  _ = require("underscore");

module.exports = function (fbPath, types) {
  var fbRoot = new Firebase(fbPath);
  
  var db = { data: {}},
    data = db.data;
  
  types.forEach(function (type) {
    data[type] = {};
    data[type].values = [];
    data[type].ids = [];
    data[type].cloud = fbRoot.child(type);
  
    data[type].cloud.on("child_added", function (snap) {
      var remoteItem = snap.val(),
        stringified = JSON.stringify(remoteItem),
        localIndex = data[type].values.length;
      
      data[type].values[localIndex] = remoteItem;
      data[type].ids[localIndex] = snap.name();
    });
    
    data[type].cloud.on("child_removed", function (snap) {
      var remoteItem = snap.val(),
        stringified = JSON.stringify(remoteItem),
        localIds = data[type].ids,
        localItemIndex = localIds.indexOf(snap.name());
      
      if (~localItemIndex) {
        data[type].values.splice(localItemIndex, 1);
        localIds.splice(localItemIndex, 1);
      }
    });
    
    data[type].cloud.on("child_changed", function (snap) {
      var remoteItem = snap.val(),
        stringified = JSON.stringify(remoteItem),
        localIds = data[type].ids,
        localItemIndex = localIds.indexOf(snap.name());
  
      if (~localItemIndex) {
        data[type].values[localItemIndex] = remoteItem;
      }
    });
  });
  
  db.read = function (type, fn) {
    var values = data[type].values;
    fn(null, values.map(function (obj, i) {
      var id = data[type].ids[i];
      return _.extend(_.clone(obj), { id: id });
    }));
  };
  
  db.create = function (type, obj, fn) {
    var ref = data[type].cloud.push(obj, function (e) {
      if (e) return fn(e);
      fn(null, _.extend(_.clone(obj), {
        id: ref.name()
      }));
    });
  };
  
  db.update = function (type, id, attributes, fn) {
    var info = getResource(data[type], id),
      ref = info.ref,
      obj = info.obj;
    
    if (!obj)
      return fn(
        new Error("Resource not found in database"));
    
    // Can't update id
    _.extend(obj, _.omit(attributes, "id"));
    
    ref.set(obj, function (e) {
      if (e) return fn(e);
      fn(null,
        _.extend(_.clone(obj), { id: id }));
    });
  };
  
  db.delete = function (type, id, fn) {
    var info = getResource(data[type], id),
      ref = info.ref,
      obj = info.obj;
      
    if (!obj)
      return fn(
        new Error("Resource not found in database"));
    
    ref.remove(function (e) {
      if (e) return fn(e);
      fn(null,
        _.extend(_.clone(obj), { id: id }));
    });
  };
  
  function getResource(dataObj, id) {
    var index = dataObj.ids.indexOf(id),
      obj = dataObj.values[index];
    
    if (!obj) return {};
    
    return {
      ref: dataObj.cloud.child(id),
      obj: obj
    };
  }

  return db;
};
```

Taken from [Apper](http://bish.nu/apper) [source](https://github.com/asyncanup/apper/blob/v2.5.0/plugins/firebase.js).
