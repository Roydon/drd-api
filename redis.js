const redis = require("redis");
const client = redis.createClient();
 
client.on("error", function(error) {
  console.error(error);
});


client.on("error", function(error) {
    console.error(error);
  });
  
client.on('connect', (() => {
    console.log('redis Connected');
}));


module.exports = {
    client
}