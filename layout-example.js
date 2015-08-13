/*global document, $, window, showdown, DaSpec*/
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
				//jshint evil:true
				eval(systemUnderTest + '\n' + steps);
				//jshint evil:false
			},
		runner, result, markdownFormatter, counter;
		try {
			runner = new DaSpec.Runner(defineSteps);
			counter = new DaSpec.CountingResultListener(runner);
			markdownFormatter = new DaSpec.MarkdownResultFormatter(runner);
			runner.execute(spec);
			result = markdownFormatter.formattedResults();
		} catch (e) {
			result = '    ' + (e.stack || e.message || e.name || 'there was a problem executing the specification');
		}
		return {
			text: result,
			counts:  counter.current
		};
	},
	daspecExamplePageLoad =  function () {
		'use strict';
		var runButton = document.getElementById('runButton'),
		markdownArea = document.getElementById('markdownArea'),
		formattedMarkdownArea = document.getElementById('formattedMarkdownArea'),
		formattedOutputArea = document.getElementById('formattedOutputArea'),
		stepsArea = document.getElementById('stepsArea'),
		sutArea = document.getElementById('sutArea'),
		updateAlert = function (counts) {
			var alertClass;
			if (counts.error || counts.failed) {
				alertClass = 'alert-danger';
			} else if (counts.skipped) {
				alertClass = 'alert-warning';
			} else if (counts.passed) {
				alertClass = 'alert-success';
			} else {
				alertClass = 'alert-warning';
			}
			$('#outputSummary').removeClass('alert-warning alert-success alert-danger').addClass(alertClass);
			Object.keys(counts).forEach(function (key) {
				var field = $('#outputSummary [role=' + key + ']');
				if (counts[key]) {
					field.show().find('[role=value]').text(counts[key]);
				} else {
					field.hide();
				}
			});
		},
		rerun = function () {
			var result = runDaSpec(markdownArea.value, stepsArea.value, sutArea.value);
			$('#outputArea').text(result.text);
			updateAlert(result.counts);
			formattedOutputArea.innerHTML = converter.makeHtml(result.text);
		},
		converter = new showdown.Converter({simplifiedAutoLink: true, strikethrough: true, ghCodeBlocks: true, tables: true});
		markdownArea.addEventListener('change', function () {
			formattedMarkdownArea.innerHTML = converter.makeHtml(markdownArea.value);
		});
		formattedMarkdownArea.innerHTML = converter.makeHtml(markdownArea.value);

		runButton.addEventListener('click', rerun);
	};

window.addEventListener('load', daspecExamplePageLoad);
