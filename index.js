var fs = require('fs');
var util = require('util');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var domain = require('domain').createDomain();
var _ = require('underscore');

function Walker (options){
	var that = this;
	options = options || {};
	this.relativePaths = options.relativePaths || false;

	// -- Wire Through the Error
	domain.on('error', function (err){
		that.emit('error', err);
	});
};
util.inherits(Walker, EventEmitter);


Walker.prototype.find = function (dir, cb){
	var that = this;
	var basename = path.basename(dir);
	var directory = path.dirname(dir);
	var recursiveIndex = dir.indexOf('**');

	var dirpath =  recursiveIndex == -1 ? directory : directory.substring(0, recursiveIndex);
	var files = [];
	var counter = 0;

	function walkin(d) {
		counter++;
		fs.readdir(d, domain.intercept(function (items){
			items.forEach(function (item){

				var entity = path.join(d, item);
				var stats = fs.statSync(entity);

				if (stats.isDirectory() && recursiveIndex > 0){
					walkin(entity);
				}
				else if (stats.isFile()) {
					if (path.extname(basename) == path.extname(item)){
						files.push(entity);
						that.emit('file', entity);
					}
				}

			});

			counter--;
			if (counter == 0){
				that.emit('done', files);
				cb(files);
			}

		}));
	};

	walkin(dirpath);
};


var walker = new Walker();

walker.on('error', function (err){
	console.info("ERROR:\t" + err);
});

walker.on('file', function (item) {
	console.info("ITEM:\t" + item);
});

walker.on('done', function (items){
	console.info('ITEMS:\t' + items);
});

walker.find("D:\\github\\Iskamo\\features\\**\\*.html", function (files){
	console.info('All the files!');
	console.info(files);
});

