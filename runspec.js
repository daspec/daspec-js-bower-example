/*global DaSpec, window */
var runDaSpec = function (spec, steps, systemUnderTest) {
	'use strict';
	var exportObject = function (object) {
			var v;
			for (v in object) {
				window[v] = object[v];
			}
		},
		defineSteps = function (context) {
			exportObject(context); // syntax sugar, allow steps to just call defineStep instead of context.defineStep
			eval(systemUnderTest + '\n' + steps);
		},
		runner, result, markdownFormatter, counter;
	try {
		runner = new DaSpec.Runner(defineSteps);
		markdownFormatter = new DaSpec.MarkdownResultFormatter(runner);
		counter = new DaSpec.CountingResultListener(runner);

		runner.execute(spec);
		result = markdownFormatter.formattedResults();
	} catch (e) {
		result = '    ' + (e.stack || e.message || e.name || 'there was a problem executing the specification');
	}
	return {
		text: result,
			counts:  counter.current
	};
};

