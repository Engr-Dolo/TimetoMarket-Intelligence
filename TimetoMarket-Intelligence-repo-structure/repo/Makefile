# TimetoMarket Intelligence — monorepo task runner
# Node workspaces: timetomarket/ussd-gateway, whatsapp-bot, payments
# Python modules:  data-pipeline, timetomarket/ai-listing-engine, network-intelligence/*

SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help install install-node install-python \
        test test-node test-python \
        lint lint-node lint-python

help:
	@echo "TimetoMarket Intelligence — available targets"
	@echo ""
	@echo "  install        Install all Node and Python dependencies"
	@echo "  install-node   npm install (workspace packages)"
	@echo "  install-python pip install dev tools + module requirements"
	@echo "  test           Run all tests (Node + Python)"
	@echo "  test-node      Jest / node:test across Node workspaces"
	@echo "  test-python    pytest across Python modules"
	@echo "  lint           Lint everything"
	@echo "  lint-node      ESLint + Prettier check across Node workspaces"
	@echo "  lint-python    ruff + black --check across Python modules"

# ── Install ────────────────────────────────────────────────────────────────────

install: install-node install-python

install-node:
	npm install

install-python:
	pip install black ruff pytest
	@for req in $$(find . -name requirements.txt \
	    -not -path '*/node_modules/*' \
	    -not -path '*/.git/*'); do \
		echo "  Installing $$req ..."; \
		pip install -r "$$req"; \
	done

# ── Test ───────────────────────────────────────────────────────────────────────

test: test-node test-python

test-node:
	npm test --workspaces --if-present

# Exit code 5 = no tests collected; acceptable at early stage.
test-python:
	set +e; python -m pytest -q --tb=short; ec=$$?; \
	[ $$ec -eq 0 ] || [ $$ec -eq 5 ]

# ── Lint ───────────────────────────────────────────────────────────────────────

lint: lint-node lint-python

lint-node:
	npm run lint --workspaces --if-present

lint-python:
	ruff check .
	black --check .
