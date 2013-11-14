#!/usr/bin/env node

/*jshint node: true */

var program = require('commander');
var nano = require('nano');
var utils = require('utils');
var async = require('async');
var log = utils.log();

var prompt = require('prompt');
prompt.start();

program
.version('0.0.1')
.option('-w, --wipe <url>', 'specify a couchURL to wipe')
.option('-r, --replicate [from] [to]', 'specify a couchURL to wipe')
.parse(process.argv);


var callback = function  (error) {
	'use strict';
	if(error)
	{
		log.error(error);
	}
	else{
		log('done');
	}
};

if(program.wipe)
{
	prompt.get(['confirm'], utils.cb(callback, function(result){
		'use strict';
		if(result.confirm === 'Y')
		{
			log('wiping ' + program.wipe);
			var toBeWiped = nano(program.wipe);
			toBeWiped.db.list(utils.cb(callback, function(dbs){
				async.forEachSeries(dbs, function  (db, cbk) {
					if(db.substring(0, 1) === '_')
					{
						log('skipping ' + db);
						cbk();
						return;
					}
					log('destroying ' + db);
					toBeWiped.db.destroy(db, utils.cb(cbk, function(){
						log('destroyed ' + db);
						cbk();
					}));
				}, utils.cb(callback, function(){
					log('finished wipe');
					callback();
				}));
			}));
		}
		else
		{
			log('cancelled');
			callback();
		}
	}));
}

if(program.replicate)
{
	console.dir(program.replicate);
}
