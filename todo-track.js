const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const boom = require('express-boom');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const tasks = require('./routes/tasks');
const home = require('./routes/home');
const auth = require('./routes/auth')
const registers = require('./routes/users')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


//Middleware
app.set('view engine', 'pug');
app.set('views', './public/views');
app.use(boom());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/tasks', tasks);
app.use('/', home);
app.use('/api/auth', auth);
app.use('/api/users', registers);



//Configuration

// console.log('Application Name: ' + config.get('name'));
// console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));


//Custom Middleware

// app.use(logger);
// app.use(authenticator);

//When using debugging, you have to set the environment variable to the namespace for that particular debugger....export DEBUG=app:startup etc. or multiple DEBUG=app:startup,app:db OR use wild card DEBUG=app:*






const port = process.env.PORT || 8080;
app.listen(port, () => startupDebugger(`Gator listening on port ${port}`));


var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' })
 

if(process.env.NODE_ENV === 'development'){
    startupDebugger('Morgan is enabled');
    app.use(morgan('combined', { stream: accessLogStream, /*skip: function (req, res) { return res.statusCode < 400 }*/ }));
}

mongoose.connect('mongodb://localhost/todo-trackerDB', {useNewUrlParser: true})
.then(() => dbDebugger('Connected to MongoDB...'))
.catch((err) => console.error('Could not connect to MongoDB \n', err));












//route params for necessary info
//query string params for any additional data