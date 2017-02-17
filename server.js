'use strict';
const Hapi 	= require('hapi'),
	fs 		= require('fs'),
  	Path 	= require('path'),
	Inert 	= require('inert');

const config  = require('./private/Configs/config');
const port = process.env.PORT || 5000;

const server = new Hapi.Server({ connections: { routes: { files: { relativeTo: Path.join(__dirname, 'public') } } } });
server.connection({port: port },{ cors: true });

const routes = require('./private/Routes/routes');
server.register(Inert, () => {});
server.route(routes);
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server ready'+server.info.uri);
});