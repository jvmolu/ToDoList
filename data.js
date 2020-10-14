module.exports.getDate = function() {
  let Today = new Date();
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  let day = Today.toLocaleDateString("en-US",options);
  return day;
}

module.exports.getDay = function() {
  let Today = new Date();
  let options = { weekday: 'long'};
  let day = Today.toLocaleDateString("en-US",options);
  return day;
}
