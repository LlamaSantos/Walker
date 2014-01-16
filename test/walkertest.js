describe("Walker tests", function (){
	var chai = require('chai');
	var Walker = require('../index.js');

	chai.should();

	describe("Callback tests", function (){

		it ('should work', function (done){
			var walker = new Walker();
			walker.find('./test/**/*.txt', function (err, files){
				files.should.have.length(2);
				done();
			});
		});
	})
});