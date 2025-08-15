const express = require('express');
const path = require('path');
const app = express();

const viewPath = __dirname + '/dist/views/';
const dataPath = __dirname + '/data/';

// const port = 8080;
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (req,res,next) {
    console.log('/' + req.method + ' ' + req.path);
    next();
});

app.get('/', function(req,res){
    res.sendFile(viewPath + 'index.html');
});

app.listen(port, function () {
    console.log('App listening on port 8080!')
})