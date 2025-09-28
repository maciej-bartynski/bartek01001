.PHONY: help setup install build test dev-crud dev-async-tasks-queue dev-deep-merge dev-json-storage clean npm docker docker-build docker-run docker-stop changeset version release uninstall-fadro

help:
	@echo "Available commands:"
	@echo "  setup       - Build and run Docker container (first time or after changes)"
	@echo "  install     - Install all dependencies in container"
	@echo "  build       - Build all packages in container"
	@echo "  test        - Run tests for all packages in container"
	@echo "  dev-crud    - Start development mode for crud package"
	@echo "  dev-async-tasks-queue - Start development mode for async-tasks-queue package"
	@echo "  dev-deep-merge - Start development mode for deep-merge package"
	@echo "  dev-json-storage - Start development mode for json-storage package"
	@echo "  clean       - Clean all build artifacts in container"
	@echo "  npm cmd=... - Run npm command in container (e.g. make npm cmd=\"install\")"
	@echo "  docker cmd=... - Run docker-compose command (e.g. make docker cmd=\"logs\")"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run  - Run Docker container in background"
	@echo "  docker-stop - Stop Docker container"
	@echo "  changeset   - Create new changeset"
	@echo "  version     - Bump versions based on changesets"
	@echo "  release     - Publish packages to NPM"
	@echo "  uninstall-fadro  - Uninstall fadro from all packages"

setup:
	docker-compose up -d --build

install:
	docker exec bartek01001 npm ci

npm:
	docker exec bartek01001 npm $(cmd)

docker:
	docker-compose $(cmd)

build:
	docker exec bartek01001 npm run build

test:
	docker exec bartek01001 npm run test

dev-crud:
	docker exec bartek01001 npm run dev:crud

dev-async-tasks-queue:
	docker exec bartek01001 npm run dev:async-tasks-queue

dev-deep-merge:
	docker exec bartek01001 npm run dev:deep-merge

dev-json-storage:
	docker exec bartek01001 npm run dev:json-storage

clean:
	docker exec bartek01001 npm run clean

docker-build:
	docker-compose build

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

changeset:
	docker exec bartek01001 npx changeset

version:
	docker exec bartek01001 npx changeset version

release:
	docker exec bartek01001 npx changeset publish

uninstall-fadro:
	@echo "Uninstalling @bartek01001/fadro from all packages..."
	docker exec bartek01001 npm uninstall @bartek01001/fadro --workspace=packages/async-tasks-queue
	docker exec bartek01001 npm uninstall @bartek01001/fadro --workspace=packages/deep-merge
	docker exec bartek01001 npm uninstall @bartek01001/fadro --workspace=packages/json-storage
	docker exec bartek01001 npm uninstall @bartek01001/fadro --workspace=packages/crud
