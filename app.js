const express = require('express');
const bodyParser = require('body-parser');
const data = require(__dirname + '/data.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/toDoListDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "task has to has some Name"]
  }
});
const listSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Give the new list a name"]
  },
  tasks: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);
const item1 = new Item({
  name: "Buy Food"
});

const item2 = new Item({
  name: "Eat Food"
});

const defaultItems = [item1,item2];

app.get('/',function(req,res){
  let day = data.getDay();

   Item.find(function(err,docs){
    if(err){
      console.log(err);
    } else{
        res.render("list", {
          listHeading : day,
          tasks : docs
        });
    }
  });
});


app.post('/',function(req,res){
  const newItem = new Item({
    name:  req.body.newItem
  });
  if(req.body.submit == data.getDay())
  {

    newItem.save(function(err){
      if(!err)
      {
        res.redirect('/');
      }
      else
      {
        console.log(err);
        res.redirect('/');
      }
    });
  }
  else
  {
    const listname = _.capitalize(req.body.submit);
    List.findOne({name: listname}, function(err,list){
      if(!err)
      {
        list.tasks.push(newItem);
        list.save();
        res.redirect('/' + listname);
      }
      else
      {
        console.log("ERROR: " + err);
        res.redirect('/' + listname);
      }
    });
  }

});

app.post('/delete', function(req,res){
  if(req.body.listName == data.getDay())
  {
    Item.findByIdAndRemove(req.body.checkbox, function(err){
      if(!err)
      {
        console.log("DELETED SUCCESSFULLY");
      }
    });
    res.redirect('/');
  }
  else
  {
    const listname = _.capitalize(req.body.listName);
    List.findOneAndUpdate({name: listname},{$pull: {tasks: {_id: req.body.checkbox}}},function(err,list){
      if(!err)
      {
        res.redirect('/' + listname);
      }
    });
  }

});

app.get('/:customListName', function(req,res){
  const listHeadingZ = _.capitalize(req.params.customListName);
  List.findOne({name: listHeadingZ}, function(err,list){
    if(!err)
    {
      if(list) // give that list to user
      {
        res.render("list", {
          listHeading: list.name,
          tasks: list.tasks
        });
      }
      else // we create a new list
      {
          const newList = new List({
            name: listHeadingZ,
            tasks:  []
          });
          newList.save();
          res.redirect('/' + listHeadingZ);
      }
    ;}
  });
});


app.listen(3000, function(){
  console.log("server running at port 3000");
})
