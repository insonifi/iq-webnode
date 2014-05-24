var client = new Faye.Client('http://localhost:8080/iq'),
  subscription = client.subscribe('/channel', function(message) {
    console.log(message);
  });

client.subscribe('/config', function(message) {
  console.log('Config:', message);
});
client.subscribe('/state', function(message) {
  console.log('State:', message);
});
