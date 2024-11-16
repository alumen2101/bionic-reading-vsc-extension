# VS Code Text Decorations Extension

This is a Visual Studio Code extension for applying text decorations with customizable styles, such as bold text, faded effects, and background colors. It is designed to work with different file types, including plain text and code files, and provides an interactive settings interface via a WebView.

## Features

- **Text Highlighting**: Apply bold and faded decorations to specific portions of text.
- **Customizable Styles**: Change text color, background color, opacity, and the range of word highlighting.
- **Dynamic File Handling**:
  - Highlight words in `.txt` and `README` files.
  - Highlight comments in code files (JavaScript, Python, HTML, etc.).
- **Interactive Settings Panel**: Adjust styles using a WebView interface.
- **Toggle Decorations**: Enable or disable decorations on demand.
- **Language-Aware Comment Detection**: Automatically detects and applies styles to comments based on the programming language.

## Installation



## Usage

1. **Activate the extension**:
   - Open a `.txt`, `README`, or supported code file in the editor.
   - Run the command `Toggle Decorations` from the Command Palette (`Ctrl+P`).
   - Run the command `Show WebView` from the Command Palette (`Ctrl+Shift+P`).

2. **Customize styles**:
   - Run the `Show WebView` command from the Command Palette to open the settings panel.
   - Adjust the styles (text color, background color, opacity, and range) and apply changes.
   - View changes dynamically as you edit the document.

## Commands

| Command           | Description                                     |
|-------------------|-------------------------------------------------|
| `Toggle Decorations` | Enable or disable text decorations in the active editor. (`Ctrl+P`)|
| `Show WebView`       | Open the WebView interface to customize styles.(`Ctrl+Shift+P`)          |

## Supported File Types

- **Plain Text**: `.txt`, `README`.
- **Programming Languages**: JavaScript, TypeScript, Python, C, C++, Java, HTML, CSS, PHP, Go, and more.

## Development Notes

### Decoration Logic
- `applyDecorations`: Applies decorations dynamically based on file type.
- `guessFileType`: Identifies the file type and retrieves the relevant comment ranges.

### Customization
- The WebView allows real-time adjustments of decoration styles.
- User input is processed through the `handleWebViewInput` function.

## Example



## Contributing

Feel free to submit issues and pull requests for feature enhancements, bug fixes, or suggestions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
