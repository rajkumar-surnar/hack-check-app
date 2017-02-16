'use strict';
const Hapi 	= require('hapi'),
	fs 		= require('fs'),
  	Path 	= require('path'),
	Inert 	= require('inert');

const config  = require('./private/Configs/config');

const server = new Hapi.Server({ connections: { routes: { files: { relativeTo: Path.join(__dirname, 'public') } } } });
server.connection({port: config.port },{ cors: true });

const routes = require('./private/Routes/routes');
server.register(Inert, () => {});
server.route(routes);
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server ready'+server.info.uri);
});