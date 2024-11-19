const vscode = require("vscode");

let decorationsActive = false; // Track if decorations are active
let editor; // Reference to the current active editor
let colorDecorationType, fadedDecorationType; // Decoration types for text and background

let textColor ; // Default text color
let opacity = "0.5"; // Default opacity for faded effect
let bionicRange = 50; // Default bionic range (portion of word to highlight)
let bgColor ; // Default background color


// Function to create a bold decoration with a specific text and background color
function createDecorationType(color, backgroundColor) {
  return vscode.window.createTextEditorDecorationType({
    fontWeight: "bold", // Make the text bold
    color: color, // Set text color
    backgroundColor: backgroundColor, // Set background color
  });
}

// Function to create a decoration with a specific opacity for the faded effect
function createFadedDecorationType(opacity) {
  return vscode.window.createTextEditorDecorationType({
    opacity: opacity, // Set opacity for faded effect
  });
}

// Function to apply decorations (color and faded effect) to the text in the editor
function applyDecorations() {
  if (!editor || !decorationsActive) return; // Only apply if the editor is active and decorations are enabled

  const document = editor.document; // Get the current document
  const fullText = document.getText(); // Get the full text of the document
  const colorRanges = []; // Ranges where text color should be applied
  const fadedRanges = []; // Ranges where faded effect should be applied
  const wordPattern = /\b\w+\b/g; // Regular expression to match words
  let match;

  // Check if the file is a .txt or README file (based on file extension or name)
  const fileName = document.fileName;

  if (fileName.endsWith('.txt') || fileName.toLowerCase().includes('readme')) {
    // Handle .txt and README files
    while ((match = wordPattern.exec(fullText)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const mid = start + Math.ceil(match[0].length / (100/bionicRange));
      colorRanges.push(
        new vscode.Range(document.positionAt(start), document.positionAt(mid))
      );
      fadedRanges.push(
        new vscode.Range(document.positionAt(mid), document.positionAt(end))
      );
    }
  } else {
    // Handle other file types (like code files)
    const commentRanges = guessFileType(document); // Guess the comment blocks based on the file type
    commentRanges.forEach((range) => {
      const commentText = document.getText(range);
      let startOffset = document.offsetAt(range.start);
      while ((match = wordPattern.exec(commentText)) !== null) {
        const start = startOffset + match.index;
        const end = start + match[0].length;
        const mid = start + Math.ceil(match[0].length / (100/bionicRange));
        colorRanges.push(
          new vscode.Range(document.positionAt(start), document.positionAt(mid))
        );
        fadedRanges.push(
          new vscode.Range(document.positionAt(mid), document.positionAt(end))
        );
      }
    });
  }

  // Apply the decorations (color and faded) to the editor
  editor.setDecorations(colorDecorationType, colorRanges);
  editor.setDecorations(fadedDecorationType, fadedRanges);
}

// Function to toggle the active state of decorations
function toggleDecorations() {
  decorationsActive = !decorationsActive; // Toggle the state of decorations
  applyDecorations(); // Reapply decorations based on the new state

  // Display a status message in the VS Code status bar
  const statusBarText = decorationsActive ? "Decorations Active" : "Decorations Inactive";
  vscode.window.setStatusBarMessage(statusBarText, 2000); // Show status message for 2 seconds
}

// Function to guess the file type and return the appropriate comment ranges
function guessFileType(document) {
  const languageId = document.languageId; // Get the language of the document
  const commentRanges = []; // Array to store comment ranges

  switch (languageId) {
    case "javascript":
    case "typescript":
      // For JavaScript and TypeScript, find single-line and block comments
      findComments(document, /\/\/.*$/gm, /\/\*[\s\S]*?\*\//gm, commentRanges);
      break;
    case "python":
      // For Python, find single-line comments starting with '#'
      findComments(document, /#.*$/gm, null, commentRanges);
      break;
    case "c":
    case "cpp":
    case "java":
      // For C, C++, and Java, find single-line and block comments
      findComments(document, /\/\/.*$/gm, /\/\*[\s\S]*?\*\//gm, commentRanges);
      break;
    case "html":
      // For HTML, find comments enclosed in <!-- -->
      findComments(document, /<!--[\s\S]*?-->/gm, null, commentRanges);
      break;
    case "css":
      // For CSS, find block comments enclosed in /* */
      findComments(document, /\/\*[\s\S]*?\*\//gm, null, commentRanges);
      break;
    case "php":
      // For PHP, find both inline (//, #) and block comments
      findComments(document, /\/\/.*$/gm, /\/\*[\s\S]*?\*\//gm, commentRanges);
      findComments(document, /#.*$/gm, null, commentRanges); // Handle PHP inline comments
      break;
    case "go":
      // For Go, find single-line and block comments
      findComments(document, /\/\/.*$/gm, /\/\*[\s\S]*?\*\//gm, commentRanges);
      break;
    // Add additional languages and their comment patterns here.
    default:
      // Handle other languages if necessary
      break;
  }

  return commentRanges; // Return the array of comment ranges
}

// Function to find comments in the document based on provided patterns
function findComments(document, lineCommentPattern, blockCommentPattern, commentRanges) {
  const text = document.getText(); // Get the full text of the document
  let match;

  if (lineCommentPattern) {
    // Find line comments using the provided pattern
    while ((match = lineCommentPattern.exec(text)) !== null) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      commentRanges.push(new vscode.Range(start, end)); // Add the comment range to the list
    }
  }

  if (blockCommentPattern) {
    // Find block comments using the provided pattern
    while ((match = blockCommentPattern.exec(text)) !== null) {
      const start = document.positionAt(match.index);
      const end = document.positionAt(match.index + match[0].length);
      commentRanges.push(new vscode.Range(start, end)); // Add the comment range to the list
    }
  }
}

// Function to show a WebView panel for user to adjust decoration settings
function showWebView(context) {
  const panel = vscode.window.createWebviewPanel(
    "myWebView", // Unique ID for the webview
    "My WebView", // Title of the webview
    vscode.ViewColumn.Three, // Open the webview in the third column
    { enableScripts: true } // Allow JavaScript to run in the webview
  );

  panel.webview.html = getWebviewContent(context); // Set the content of the webview (HTML form)

  panel.webview.onDidReceiveMessage(
    handleWebViewInput, // Handle input messages from the webview
    undefined, // No specific context for the message handler
  );
}

// Function to handle messages sent from the WebView (e.g., style changes)
function handleWebViewInput(message) {
  switch (message.command) {
    case "applyStyles":
      bionicRange = message.bionicRange 
      // Apply the new styles received from the WebView
      colorDecorationType.dispose();
      fadedDecorationType.dispose();

      colorDecorationType = createDecorationType(message.textColor, message.bgColor);
      fadedDecorationType = createFadedDecorationType(message.opacity);

      // Reapply the decorations with the new styles
      applyDecorations();
      break;
  }
}

// Function to generate the HTML content for the WebView (styling form)
function getWebviewContent(context) {
  const path = require('path');
  const fs = require('fs');
  
  const filepath = vscode.Uri.file(path.join(context.extensionPath, 'WebView.html'));
  return fs.readFileSync(filepath.fsPath, 'utf-8');
}

// The activate function which wires everything up
function activate(context) {
  // Create decoration types based on the current styles
  colorDecorationType = createDecorationType(textColor, bgColor);
  fadedDecorationType = createFadedDecorationType(opacity);

  // Register commands for toggling decorations and showing the WebView
  const disposableToggleDecorations = vscode.commands.registerCommand(
    "extension.toggleDecorations",
    toggleDecorations
  );

  const disposableShowWebView = vscode.commands.registerCommand(
    "extension.showWebView",
    () => showWebView(context) // Pass context to WebView
  );

  // Push the commands to the context subscription
  context.subscriptions.push(
    disposableToggleDecorations,
    disposableShowWebView,
    vscode.workspace.onDidChangeTextDocument(applyDecorations), // Apply decorations when document changes
    vscode.window.onDidChangeActiveTextEditor((newEditor) => {
      if (newEditor) {
        editor = newEditor;
        applyDecorations(); // Reapply decorations when active editor changes
      }
    })
  );

  // Apply decorations initially if there is an active editor
  if (editor) {
    applyDecorations();
  }
}

// Deactivate function (currently not used)
function deactivate() {}

module.exports = {
  getWebviewContent,  
  createFadedDecorationType,  
  createDecorationType,
  activate,
  deactivate,
};
