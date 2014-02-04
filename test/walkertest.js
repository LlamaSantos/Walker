describe("Walkin tests", function (){
	var chai = require('chai');
	var Walkin = require('../index.js');

	chai.should();

	describe("Callback tests", function (){

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
	})
});