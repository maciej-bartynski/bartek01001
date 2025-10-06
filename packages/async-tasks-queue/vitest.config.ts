import path from 'path';
import globalConfig from '../../vitest.config.root.ts';
import { defineConfig, mergeConfig } from 'vitest/config'

const x = mergeConfig(globalConfig, {
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
})

export default defineConfig(x);