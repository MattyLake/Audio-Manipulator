const express = require('express');
const path = require('path');
const app = express();

const viewPath = __dirname + '/dist/views/';
const dataPath = __dirname + '/data/';

// const port = 8080;
const port = process.env.PORT || 8080;

app.use('/static', express.static(path.join(__dirname, 'dist', 'static')))

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