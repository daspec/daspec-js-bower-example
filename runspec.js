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
		runner, result, markdownFormatter, counter, compositeFormatter;
	try {
		markdownFormatter = new DaSpec.MarkdownResultFormatter();
		counter = new DaSpec.CountingResultFormatter();
		compositeFormatter = new DaSpec.CompositeResultFormatter();
		compositeFormatter.add(markdownFormatter);
		compositeFormatter.add(counter);
		runner = new DaSpec.Runner(defineSteps, compositeFormatter);
		runner.example(spec);
		result = markdownFormatter.formattedResults();
	} catch (e) {
		result = '    ' + (e.stack || e.message || e.name || 'there was a problem executing the specification');
	}
	return {
		text: result,
			counts:  counter.current
	};
};

