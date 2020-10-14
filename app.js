const express = require('express');
const bodyParser = require('body-parser');
const data = require(__dirname + '/data.js');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let tasks = ["Buy Food", "Make Food", "Eat Food"];
let workTasks = [];

app.get('/',function(req,res){
  let day = data.getDay();
  res.render("list", {
    listHeading : day,
    tasks : tasks
  });
  res.sendFile(__dirname + "/views/list.ejs");
});
app.post('/',function(req,res){
  let item = req.body.newItem;
  console.log(req.body);
  if(req.body.submit === "Work Tasks")
  {
    workTasks.push(item);
    res.redirect('/work');
  }
  else
  {
    tasks.push(item);
    res.redirect('/');
  }
});


app.get('/work', function(req,res){
  res.render("list", {
    listHeading : "Work Tasks",
    tasks : workTasks
  });
});
app.post('/work', function(req,res){
  let newItem = req.body.newItem;
  workTasks.push(newItem);
  res.redirect('/Work');
});

app.listen(3000, function(){
  console.log("server running at port 3000");
})
