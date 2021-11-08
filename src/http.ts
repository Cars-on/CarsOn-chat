import 'reflect-metadata';
import path from 'path';
import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import { createServer } from 'http';

const app = express();

const server = createServer(app);

mongoose.connect(
  'mongodb://root:carson_app@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(express.static(path.join(__dirname, '..', 'public')));

const io = new Server(server);

io.on('connection', socket => {
  console.log('Socket', socket.id);
});

app.use(express.json());

export { server, io };
