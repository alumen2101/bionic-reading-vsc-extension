const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const ext = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('decoration type 1', () => {
		assert.equal(
			ext.createDecorationType("#ffffff", "#000000"),
			vscode.window.createTextEditorDecorationType({ 
				fontWeight: "bold",
				color: "#ffffff", 
				backgroundColor: "#000000", 
			})
		)
	});

	test('decoration type 2', () => {
		assert.equal(
			ext.createDecorationType("#eeeeee", "#eeeeee"),
			vscode.window.createTextEditorDecorationType({ 
				fontWeight: "bold",
				color: "#eeeeee", 
				backgroundColor: "#eeeeee", 
			})
		)
	});

	test('faded decoration type', () => {
		assert.equal(
			ext.createFadedDecorationType("50"),
			vscode.window.createTextEditorDecorationType({ 
				opacity: "50",
			})
		)
	});

});
