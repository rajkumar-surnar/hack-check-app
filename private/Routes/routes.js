const fileHandlers 		       = require('./fileHandlers');

module.exports = [
    { method: 'GET', path: '/{param*}', config: { handler: { directory: { path: '.', redirectToSlash: true,index: true } }}},
    { method: 'POST', path: '/fileUpload', config: { payload:{ maxBytes: 209715200, output:'stream',parse: false }, handler: fileHandlers.uploadFiles } },
	{ method: 'GET', path: '/getHackReport', config: { handler: fileHandlers.getHackReport } }
];