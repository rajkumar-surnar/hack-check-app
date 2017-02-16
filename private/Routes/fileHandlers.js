"use strict";
var multiparty  = require('multiparty'),
    fs          = require('fs'),
    satelize    = require('satelize'),
    config      = require('../Configs/config');
module.exports.uploadFiles = function (request, reply) {
	var form = new multiparty.Form();
    form.parse(request.payload, function(err, fields, files) {
        console.log(files[0][0]);
        fs.readFile(files[0][0].path, function(err, data) {
            // console.log(files['0'].file[0]);
            console.log("Error", err);
            fs.writeFile(config.uploadDir +'/'+ files[0][0].originalFilename, data, function(err) {
                if (err){
                    console.log("Error", err);
                    return reply(err);
                } else {
                    return reply('File uploaded successfully');    
                }
            });
        });     
    });
}

module.exports.getHackReport = function (request, reply) {
    var query = request.query;
    var dashboardInput = query.dashboardInput;
    dashboardInput = dashboardInput.split(" ");
    var logPattern = query.logPattern;
    logPattern = logPattern.split(" ");
    logPattern = logPattern.filter(Boolean);
    var logRecordsArray = [];
    fs.readFileSync(config.uploadDir +'/'+ query.logFileName).toString().split('\n').forEach(function(line) {
        if(line){
            var lineOutput = "";
            var lineArray = line.split('" "');
            var logRecord = lineArray[0].split(' ');
            var secondPart = lineArray[1].split('" ');
            var originHeader = secondPart[0];
            logRecord.push(originHeader);
            secondPart = secondPart[1].split(' ');
            Array.prototype.push.apply(logRecord, secondPart);
            var originHeaderIndex = logPattern.indexOf('ORIGIN_HEADER');
            var clientIPIndex = logPattern.indexOf('CLIENT_IP:port');
            logRecord.splice(clientIPIndex-1,1);
            if(logRecord[originHeaderIndex] === "MATLAB R2013a"){
                lineOutput = lineOutput+"Yes ";
                lineOutput = lineOutput + line;
                logRecordsArray.push(lineOutput);
            }else{
                var clientIP = logRecord[clientIPIndex];
                clientIP = clientIP.split(":")[0];
                satelize.satelize({ip:clientIP}, function(err, payload) {
                    if(payload.country_code !== "IN"){
                        lineOutput = lineOutput+"Yes ";
                    }else{
                        lineOutput = lineOutput+"NO "
                    }
                    lineOutput = lineOutput + line;
                    logRecordsArray.push(lineOutput);
                });
            }
        }
    });
    var outputData = "";
    logRecordsArray.forEach(function(lineRecord){
        outputData+=lineRecord+"\n";
    });
    return reply(outputData);    
}