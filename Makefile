.PHONY: help install watch build-webview package test install-extension clean

# Default target
help:
	@echo "Harmony Prompt Assistant Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make install           - Install npm dependencies"
	@echo "  make watch             - Watch and compile TypeScript (Extension)"
	@echo "  make build-webview     - Build Webview using Vite"
	@echo "  make package           - Package extension into .vsix"
	@echo "  make test              - Run all tests"
	@echo "  make install-extension - Install the .vsix into VS Code"
	@echo "  make clean             - Remove build artifacts"

install:
	npm install

watch:
	npm run watch

build-webview:
	npm run build:webview

compile:
	npm run compile

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

clean:
	rm -rf out
	rm -rf webview-ui/dist
	rm -f *.vsix
