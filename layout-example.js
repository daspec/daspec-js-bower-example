/*global document, $, window, showdown, DaSpec, ace*/
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
			formattedMarkdownArea = document.getElementById('formattedMarkdownArea'),
			formattedOutputArea = document.getElementById('formattedOutputArea'),
			updateAlert = function (counts) {
				var alertClass;
				counts.noexec = undefined;
				if (counts.error || counts.failed) {
					alertClass = 'alert-danger';
				} else if (counts.skipped) {
					alertClass = 'alert-warning';
				} else if (counts.passed) {
					alertClass = 'alert-success';
				} else {
					alertClass = 'alert-warning';
					counts.noexec = 1;
				}
				$('#outputSummary').removeClass('alert-warning alert-success alert-danger').addClass(alertClass);
				Object.keys(counts).forEach(function (key) {
					var field = $('#outputSummary [role=' + key + ']');
					if (counts[key] || undefined) {
						field.show().find('[role=value]').text(counts[key]);
					} else {
						field.hide();
					}
				});
			},
			rerun = function () {
				var result = runDaSpec(specEditor.getValue(), stepsEditor.getValue(), sutEditor.getValue());
				outputEditor.setValue(result.text);
				updateAlert(result.counts);
				formattedOutputArea.innerHTML = converter.makeHtml(result.text);
			},
			converter = new showdown.Converter({simplifiedAutoLink: true, strikethrough: true, ghCodeBlocks: true, tables: true}),
			stepsEditor = ace.edit('stepsArea'),
			sutEditor = ace.edit('sutArea'),
			specEditor = ace.edit('markdownArea'),
			outputEditor = ace.edit('outputArea');

		specEditor.getSession().on('change', function () {
			formattedMarkdownArea.innerHTML = converter.makeHtml(specEditor.getValue());
		});
		formattedMarkdownArea.innerHTML = converter.makeHtml(specEditor.getValue());

		stepsEditor.getSession().setMode('ace/mode/javascript');
		sutEditor.getSession().setMode('ace/mode/javascript');
		specEditor.getSession().setMode('ace/mode/markdown');
		outputEditor.getSession().setMode('ace/mode/markdown');

		stepsEditor.setShowPrintMargin(false);
		specEditor.setShowPrintMargin(false);
		sutEditor.setShowPrintMargin(false);
		outputEditor.setShowPrintMargin(false);

		runButton.addEventListener('click', rerun);
		$('button[target-format]').on('click', function () {
			var btn = $(this);
			btn.siblings('input[type=radio][format=' + btn.attr('target-format') + ']').prop('checked', true);
		});
		$('[data-toggle="tooltip"]').tooltip();

	};

window.addEventListener('load', daspecExamplePageLoad);
