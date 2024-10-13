const path = require('path');
const http = require('http');
const fs = require('fs'); 
//crear el servidor web
const express = require('express');
const bodyParser = require('body-parser');
const session = require ('express-session'); 
const redis = require('redis');
const connectRedis = require('connect-redis');

const config = require(path.join(__dirname, '/servidor/Config'));

//modificar la zona horaria
process.env.TZ = 'America/Mazatlan';

var app = express();

const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Error al establecer conexión con redis. ' + err);
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: '3D33-5FE66-WppQ38ST%$',
    resave: false, //true
    saveUninitialized: true,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false // if true prevent client side JS from reading the cookie 
    }
}))


// static files
app.use(express.static(path.join(__dirname,'/client')));


// settings
app.use(bodyParser.json({limit: '10mb'}));       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '10mb',
  extended: true
})); 
app.set('views', path.join(__dirname, '/servidor/views'));
app.set('view engine', 'ejs');

// routes
app.use(require('./servidor/WebServices'));


//establecer el puerto donde se ejecturara el servidor
var server_port = config.getPuerto();  
var server_ip_address = config.getHost(); 

var server = http.createServer(app);
server.keepAliveTimeout = 0; 

server.listen(server_port, server_ip_address, function() { 
    console.log('Se inicio correctamente el servidor. Port: ' + server_port);
});

server.on('error', function(err){
  console.log('error: ' + err);
});



