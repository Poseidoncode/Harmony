.PHONY: help install watch compile build-webview lint package test install-extension clean open-storage

# Default target
help:
	@echo "Harmony Prompt Assistant Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make install           - Install npm dependencies"
	@echo "  make watch             - Watch and compile TypeScript (Extension)"
	@echo "  make compile           - Compile TypeScript once"
	@echo "  make build-webview     - Build Webview using Vite"
	@echo "  make lint              - Run ESLint"
	@echo "  make package           - Package extension into .vsix"
	@echo "  make test              - Run all tests"
	@echo "  make install-extension - Install the .vsix into VS Code"
	@echo "  make open-storage      - Open the global storage directory (macOS)"
	@echo "  make clean             - Remove build artifacts"

install:
	npm install

watch:
	npm run watch

build-webview:
	npm run build:webview

compile:
	npm run compile

lint:
	npm run lint

package: build-webview compile
	npx @vscode/vsce package

test:
	npm test

install-extension:
	@VSIX_FILE=$$(ls *.vsix | head -n 1); \
	if [ -n "$$VSIX_FILE" ]; then \
		echo "Installing $$VSIX_FILE..."; \
		code --install-extension $$VSIX_FILE; \
	else \
		echo "Error: No .vsix file found. Run 'make package' first."; \
		exit 1; \
	fi

open-storage:
	open "~/Library/Application Support/Code/User/globalStorage/harmony.harmony-prompt-assistant"

clean:
	rm -rf out
	rm -rf webview-ui/dist
	rm -f *.vsix
