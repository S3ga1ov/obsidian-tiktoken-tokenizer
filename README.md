# Obsidian TikToken Tokenizer Plugin

This plugin for [Obsidian](https://obsidian.md) displays the token count for the currently active note in the status bar. It utilizes the `@dqbd/tiktoken` library, a WebAssembly port of OpenAI's `tiktoken`, to ensure accurate tokenization according to the models used by OpenAI (specifically, it uses the `o200k_base` encoding for `gpt-4o`).

## How it works

The plugin dynamically loads the `tiktoken` WebAssembly module at runtime. When you open a note or edit its content, the plugin recalculates the number of tokens and updates the count in the status bar, providing real-time feedback.

This approach ensures that the main Obsidian application remains fast and responsive, as the heavy lifting of tokenization is handled by a separate, highly optimized WASM module.

## Installation

### From the Community Plugin list

(Coming Soon) Once the plugin is accepted into the official community plugin list, you will be able to install it directly from within Obsidian.

### Manual Installation

1.  Download the latest release from the [GitHub releases page](https://github.com/S3ga1ov/obsidian-tiktoken-tokenizer/releases).
2.  From the release, download the `main.js`, `manifest.json` and `tiktoken_bg.wasm` files.
3.  Create a new folder in your Obsidian vault's plugins folder: `YourVault/.obsidian/plugins/tiktoken-tokenizer`.
4.  Copy the downloaded files into the new folder.
5.  Reload Obsidian.
6.  Go to `Settings` -> `Community plugins`, find "TikToken Tokenizer", and enable it.

## For Developers

### Building the plugin

1.  Clone the repository:
    ```bash
    git clone https://github.com/S3ga1ov/obsidian-tiktoken-tokenizer.git
    ```
2.  Navigate to the repository folder:
    ```bash
    cd obsidian-tiktoken-tokenizer
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Run the build script:
    ```bash
    npm run build
    ```
This will create the necessary plugin files (`main.js` and `tiktoken_bg.wasm`) in the root of the repository.

## License

This plugin is licensed under the MIT License.
