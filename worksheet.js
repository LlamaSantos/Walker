var _ = require('underscore');

var tick = Ticker(function (){
	console.info('Finished');
});

tick.add(5);
tick.done();
tick.done();
tick.done();
tick.done();
tick.done();