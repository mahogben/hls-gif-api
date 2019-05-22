'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./db/db');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;

const app = express();

app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        partialsDir: ['views/partials/']
    })
);
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/v1/hls-gif', (req, res) => {
    console.log(req.query);
    let fileName =  __dirname+ '/converted/output.gif';
    let manifestInput = req.query.manifest;
    let duration = req.query.duration;
    let startTime = req.query.startTime
    try {
        let ffmpeg = spawn('ffmpeg', [ '-y', '-ss', `${startTime}`, '-t', `${duration}`, '-i', `${ manifestInput }`, '-pix_fmt', 'rgb24', '-f', 'gif', `${ fileName }`]);
        ffmpeg.on('exit', (statusCode) => {
            if (statusCode === 0) {
                console.log('conversion successful')
            }
        })
        ffmpeg
        .stderr
        .on('data', (err) => {
            console.log('err:', new String(err))
        })
    } catch (e) {
        console.error(e)
    }        
    res.status(200).send({
        message: 'GIF job submitted successfully',
        uri: fileName
    });
});

app.get('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((todo) => {
        if ( todo.id === id ) {
            return res.status(200).send({
                success:'true',
                message: 'received OK',
                todo
            });
        }
    });
    return res.status(404).send({
        success:'false',
        message:'todo does not exist'
    });
});

app.post('/api/v1/todos', (req,res) => {
    if(!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    } else if (!req.body.description) {
        return res.status(400).send({
            success: 'false',
            message: 'description required'
        });
    }
    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added OK',
        todo
    })
});

app.put('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let todoFound;
    let itemIndex;
    db.map((todo, index) => {
      if (todo.id === id) {
        todoFound = todo;
        itemIndex = index;
      }
    });
    if (!todoFound) {
      return res.status(404).send({
        success: 'false',
        message: 'todo not found',
      });
    }
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    } else if (!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required',
      });
    }
    const updatedTodo = {
      id: todoFound.id,
      title: req.body.title || todoFound.title,
      description: req.body.description || todoFound.description,
    };
    db.splice(itemIndex, 1, updatedTodo);
    return res.status(201).send({
      success: 'true',
      message: 'todo added successfully',
      updatedTodo,
    });
  });

app.delete('/api/v1/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.map((todo, index) => {
        if (todo.id === id) {
            db.splice(index, 1);
            return res.status(200).send({
                success: 'true',
                message: 'todo deleted'
            });
        }
    });
    return res.status(404).send({
        success: 'false',
        message: 'todo not found'
    });
});

//app.use('/', index);

app.set('port', process.env.PORT || 9090);
app.set('ip', process.env.NODEJS_IP || 'localhost');

app.listen(app.get('port'), function() {
    console.log('%s: Node server started on %s ...', Date(Date.now()), app.get('port'));
});