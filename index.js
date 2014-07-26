var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var five = require("johnny-five"),
    // or "./lib/johnny-five" when running from the source
    board = new five.Board();

app.listen(8000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

board.on("ready", function() {

  console.log("la placa esta lista")

  var led = new five.Led(13),
    boton = new five.Button(7)

  board.repl.inject({
    boton: boton,
    led: led
  });

  // "down" the button is pressed
  boton.on("down", function() {
    console.log("presionado!!!!");
    io.sockets.emit('boton', { estado: 'presionado'})
  });

  boton.on("up", function() {
    console.log("up!!!!");
    io.sockets.emit('boton', { estado: 'libre'})
  });

  // Create an Led on pin 13 and strobe it on/off
  // Optionally set the speed; defaults to 100ms
  led.strobe();

});