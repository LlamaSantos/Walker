var _ = require('underscore');

function Ticker(done){
	var counter = 0;
	return {
		add : function (len){
			counter += len;
		},
		done : function (){
			counter--;

			if (counter === 0)
				done();
		}
	};
};


var tick = Ticker(function (){
	console.info('Finished');
});

tick.add(5);
tick.done();
tick.done();
tick.done();
tick.done();
tick.done();