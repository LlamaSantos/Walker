var fs = require('fs');
var util = require('util');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain').createDomain();
//var async = require('async');
//var _ = require('underscore');

function Ticker(done){
	var counter = 0;
	return {
		add : function (len){
			counter += len;
		},
		done : function (){
			counter--;
			if (counter === 0){
				done();
			}
		}
	};
};



function Walkin (options){
	var that = this;
	var errors = [];

	options = options || {};
	this.relativePaths = options.relativePaths || false;
	// -- Wire Through the Error
	domain.on('error', function (err){
		errors = errors ? [err] : errors.push(err), errors;
		that.emit('error', err);
	});

	this.find = function (dir, cb){
		errors = null;
		var that = this
			, basename = path.basename(dir)
			, directory = path.dirname(dir)
			, is_wildcard = basename.replace(path.extname(basename), '') === '*'
			, recursiveIndex = dir.indexOf('**')
			, dirpath =  recursiveIndex === -1 ? directory : directory.substring(0, recursiveIndex)
			, files = []
			, counter = 0;

		var tick = Ticker(function (){
			cb(errors, files);
		});

		function walkin(dir, done){
			fs.readdir(dir, domain.intercept(function (contents){
				tick.add(contents.length);
				if (done)
					done();

				contents.forEach(function (item){
					var entity = path.join(dir, item);

					fs.stat(entity, domain.intercept(function (stats){
						if (stats.isDirectory())
							walkin(entity, tick.done);
						else{
							if (stats.isFile() 
								&& (is_wildcard && path.extname(basename) === path.extname(entity))
								|| (!is_wildcard && basename === path.basename(entity)))
								files.push(entity);

							tick.done(entity);
						} 
					}));
				});
			}));
		};

		walkin(dirpath);
	};
};
util.inherits(Walkin, EventEmitter);

module.exports = Walkin;