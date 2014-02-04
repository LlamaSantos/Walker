describe("Walkin tests", function (){
	var chai = require('chai');
	var Walkin = require('../index.js');

	chai.should();

	describe("Find tests", function (){

		it ('should work', function (done){
			var walkin = new Walkin();
			walkin.find('./test/**/*.txt', function (err, files){
				files.should.have.length(2);
				done();
			});
		});

		it ('should find all files named config.json', function (done){
			var walkin = new Walkin();
			walkin.find('./test/**/config.json', function (err, files){
				files.should.have.length(2);
				done();
			});
		});

		it ('should not throw an exception if no callback is supplied', function (done){
			var walkin = new Walkin();

			walkin.on('done', function (err, files){
				files.should.have.length(2);
				done();
			});

			walkin.find('./test/**/*.txt');
		});

		it ('should emit the "file" event when a file is found', function (done){
			var walkin = new Walkin();
			var counter = 0;
			walkin.on('file', function (file){
				file.should.be.a('string');
				++counter;
			});
			walkin.on('done', function (){
				counter.should.equal(2);
				done();
			})

			walkin.find('./test/**/*.txt');
		});
	});
	describe("Match tests", function (){

		it ('should find all files with a .txt or .json extension', function (done){
			var walkin = new Walkin;
			walkin.match('./test', /(\.txt)|(\.json)$/gi, function (err, files){
				files.should.have.length(5);
				done();
			});
		});

	});
});