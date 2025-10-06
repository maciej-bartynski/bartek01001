import path from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'
import globalConfig from '../../vitest.config.root.ts'

export default defineConfig(mergeConfig(globalConfig, {
    test: {
        sequence: {
            concurrent: false,
        },
        poolOptions: {
            threads: {
                maxThreads: 1,
                singleThread: true,
            },
        },
    },
    resolve: {
        alias: {
            '#src': path.resolve(__dirname, 'dist'),
        }
    }
}))