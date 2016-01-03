// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 
var spawn = require('child_process').exec;
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-chai" is now active!'); 

    let testRunner = new TestRunner();
	
    var disposable = vscode.commands.registerCommand('extension.runMocha', () => {
        var editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            return; 
        }
        console.log(editor.document.fileName)
        

        if(editor.document.isUntitled) {
            return
        } 
        
        
		testRunner.runTests(editor.document.fileName)
	});
	
	context.subscriptions.push(disposable);
}

class TestRunner {
    private _statusBarItem: StatusBarItem;
    
    public runTests(filename:string) {        
        
        
        if (!this._statusBarItem) { 
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left); 
        } 
        this._statusBarItem.text = "Running tests …";
        this._statusBarItem.show(); 
        
       spawn('/www/dev/lucie/node_modules/mocha/bin/mocha --compilers js:babel-core/register --recursive --reporter json '+filename, (err, result) => {
            var stats = JSON.parse(result).stats
            
            if(stats.failures) {
                this._statusBarItem.text = `Failed ${stats.failures}/${stats.tests} tests`
            } else {
                this._statusBarItem.text = `${stats.passes}/${stats.tests} tests succeeded`
            }
        })
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}