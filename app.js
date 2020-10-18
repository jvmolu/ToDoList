const express = require('express');
const bodyParser = require('body-parser');
const data = require(__dirname + '/data.js');
const mongoose = require('mongoose');
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

const Item = mongoose.model("Item", itemSchema);

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

      if(docs.length === 0){
        Item.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          }
        });
        res.redirect('/');
      }
      else{
        res.render("list", {
          listHeading : day,
          tasks : docs
        });
      }

    }
  });
});


app.post('/',function(req,res){
  const newItem = new Item({
    name:  req.body.newItem
  });
  newItem.save(function(err){
    if(!err)
    {
      res.redirect('/');
    }
  });

});

app.post('/delete', function(req,res){
  console.log(req.body);
  Item.findByIdAndRemove(req.body.checkbox, function(err){
    if(!err)
    {
      console.log("DELETED SUCCESSFULLY");
    }
  });
  res.redirect('/');
});

app.get('/:customListName', function(req,res){
  const listHeading = req.params.customListName;
  


});


app.listen(3000, function(){
  console.log("server running at port 3000");
})
