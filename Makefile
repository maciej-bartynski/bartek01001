.PHONY: help setup install build test dev-crud dev-async-tasks-queue dev-deep-merge dev-json-storage clean npm docker restart stop changeset version release uninstall-fadro

help:
	@echo "Available commands:"
	@echo "  setup       - Clean rebuild of Docker container (removes old containers/images)"
	@echo "  setup INSTALL_MODE=unsafe-install - First-time setup (creates package-lock.json)"
	@echo "  install     - Install all dependencies in container (requires package-lock.json)"
	@echo "  build       - Build all packages in container"
	@echo "  test        - Run tests for all packages in container"
	@echo "  dev-crud    - Start development mode for crud package"
	@echo "  dev-async-tasks-queue - Start development mode for async-tasks-queue package"
	@echo "  dev-deep-merge - Start development mode for deep-merge package"
	@echo "  dev-json-storage - Start development mode for json-storage package"
	@echo "  clean       - Clean all build artifacts in container"
	@echo "  npm cmd=... - Run npm command in container (e.g. make npm cmd=\"install\")"
	@echo "  docker cmd=... - Run docker-compose command (e.g. make docker cmd=\"logs\")"
	@echo "  restart     - Restart existing container (faster than setup)"
	@echo "  stop        - Stop container (keeps it for restart)"
	@echo "  changeset   - Create new changeset"
	@echo "  version     - Bump versions based on changesets"
	@echo "  release     - Publish packages to NPM"
	@echo "  uninstall-fadro  - Uninstall fadro from all packages"

setup:
	@echo "Building Docker image with INSTALL_MODE=$(INSTALL_MODE)"
	@echo "Cleaning host node_modules to avoid conflicts..."
	rm -rf node_modules
	@echo "Stopping and removing existing containers and images..."
	docker-compose down --volumes --remove-orphans
	docker rmi bartek0x1001-bartek0x1001:latest 2>/dev/null || true
	@echo "Building fresh Docker image and starting container..."
	docker-compose build
	docker-compose up -d --force-recreate
	@echo "Installing dependencies in container..."
	make install INSTALL_MODE=$(INSTALL_MODE)
	@echo "Building dependencies in container..."
	make build

install:
	@echo "Installing NPM packages with INSTALL_MODE=$(INSTALL_MODE)"
	@if [ "$(INSTALL_MODE)" = "unsafe-install" ]; then \
		echo "Running in unsafe-install mode..."; \
		docker exec -t bartek0x1001 npm install; \
	else \
		echo "Running in ci mode..."; \
		docker exec -t bartek0x1001 npm ci; \
	fi

build:
	@echo "Building all builds in container..."
	rm -rf packages/async-tasks-queue/dist
	rm -rf packages/deep-merge/dist
	rm -rf packages/json-storage/dist
	rm -rf packages/crud/dist
	@echo "Building all packages in container..."
	docker exec -t bartek0x1001 npm run build --workspace=packages/async-tasks-queue
	docker exec -t bartek0x1001 npm run build --workspace=packages/deep-merge
	docker exec -t bartek0x1001 npm run build --workspace=packages/json-storage
	docker exec -t bartek0x1001 npm run build --workspace=packages/crud

npm:
	docker exec -t bartek0x1001 npm $(cmd)

docker:
	docker-compose $(cmd)

test:
	docker exec -t bartek0x1001 npm run test --workspaces

dev-crud:
	docker exec -t bartek0x1001 npm run dev --workspace=packages/crud

dev-async-tasks-queue:
	docker exec -t bartek0x1001 npm run dev --workspace=packages/async-tasks-queue

dev-deep-merge:
	docker exec -t bartek0x1001 npm run dev --workspace=packages/deep-merge

dev-json-storage:
	docker exec -t bartek0x1001 npm run dev --workspace=packages/json-storage

clean:
	rm -rf node_modules
	rm -rf packages/async-tasks-queue/node_modules
	rm -rf packages/deep-merge/node_modules
	rm -rf packages/json-storage/node_modules
	rm -rf packages/crud/node_modules
	rm -rf packages/async-tasks-queue/dist
	rm -rf packages/deep-merge/dist
	rm -rf packages/json-storage/dist
	rm -rf packages/crud/dist

restart:
	@echo "Restarting existing container..."
	docker-compose restart

stop:
	@echo "Stopping container..."
	docker-compose stop

changeset:
	docker exec -t bartek0x1001 npm run changeset

version:
	docker exec -t bartek0x1001 npm run changeset-version

release:
	docker exec -t bartek0x1001 npm run changeset-publish

uninstall-fadro:
	@echo "Uninstalling @bartek0x1001/fadro from all packages..."
	docker exec -t bartek0x1001 npm uninstall @bartek0x1001/fadro --workspace=packages/async-tasks-queue
	docker exec -t bartek0x1001 npm uninstall @bartek0x1001/fadro --workspace=packages/deep-merge
	docker exec -t bartek0x1001 npm uninstall @bartek0x1001/fadro --workspace=packages/json-storage
	docker exec -t bartek0x1001 npm uninstall @bartek0x1001/fadro --workspace=packages/crud
