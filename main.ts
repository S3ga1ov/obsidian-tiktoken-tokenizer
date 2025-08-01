import { Plugin, MarkdownView, apiVersion } from 'obsidian';
import { get_encoding, Tiktoken } from '@dqbd/tiktoken';
import { init } from '@dqbd/tiktoken/init';
import * as fs from 'fs/promises';

export default class TiktokenTokenizerPlugin extends Plugin {
    statusBarItemEl: HTMLElement;
    private enc: Tiktoken | null = null;
    private initialized = false;

    async onload() {
        this.statusBarItemEl = this.addStatusBarItem();
        this.statusBarItemEl.setText("Initializing tokenizer...");

        try {
            const wasmPath = `${(this.app.vault.adapter as any).getBasePath()}/${this.manifest.dir}/tiktoken_bg.wasm`;
            const wasmBuffer = await fs.readFile(wasmPath);
            
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

        this.registerEvent(this.app.workspace.on('editor-change', () => this.updateTokenCount()));
        this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.updateTokenCount()));
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
