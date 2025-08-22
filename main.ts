import { Plugin, MarkdownView, debounce } from 'obsidian';
import { get_encoding, Tiktoken } from '@dqbd/tiktoken';
import { init } from '@dqbd/tiktoken/init';

export default class TiktokenTokenizerPlugin extends Plugin {
    statusBarItemEl: HTMLElement;
    private enc: Tiktoken | null = null;
    private initialized = false;
    private updateTokenCountDebounced = (_: void) => {};

    async onload() {
        this.statusBarItemEl = this.addStatusBarItem();
        this.statusBarItemEl.setText("Initializing tokenizer...");

        try {
            const wasmBuffer = await this.app.vault.adapter.readBinary(`${this.manifest.dir}/tiktoken_bg.wasm`);
            
            await init((imports) => WebAssembly.instantiate(wasmBuffer, imports));

            this.enc = get_encoding("o200k_base");
            this.initialized = true;
            this.statusBarItemEl.setText("Tokenizer ready.");
            console.log("Tiktoken tokenizer initialized successfully.");
            this.updateTokenCount();
        } catch (e) {
            console.error("Fatal error initializing Tiktoken tokenizer:", e);
            this.statusBarItemEl.setText("Tokenizer failed to load.");
            return;
        }

        this.updateTokenCountDebounced = debounce(
            () => this.updateTokenCount(),
            150,
            true
        );

        this.registerEvent(this.app.workspace.on('editor-change', () => this.updateTokenCountDebounced()));
        this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.updateTokenCountDebounced()));
    }

    updateTokenCount() {
        if (!this.initialized || !this.enc) {
            return;
        }

        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view && view.editor) {
            const text = view.editor.getValue();
            try {
                const tokenCount = this.enc.encode(text).length;
                this.statusBarItemEl.setText(`Tokens: ${tokenCount}`);
            } catch (e) {
                console.error("Error counting tokens:", e);
                this.statusBarItemEl.setText("Token count error");
            }
        } else {
            this.statusBarItemEl.setText('');
        }
    }

    onunload() {
        this.enc?.free();
        this.initialized = false;
        console.log("Tiktoken tokenizer unloaded and resources freed.");
    }
}
