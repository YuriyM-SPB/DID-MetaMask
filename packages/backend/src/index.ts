import './db';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { services } from './services';

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Mount REST on /api
app.use('/api', services);

const port = process.env.PORT || 8000;

io.on('connection', (socket: { on: (arg0: string, arg1: (msg: any) => void) => void; }) => {
	socket.on('chat message', msg => {
	  io.emit('chat message', msg);
	});
  });

app.listen(port, () =>
	console.log(`Express app listening on localhost:${port}`)
);


