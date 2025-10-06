import path from 'path'
import globalConfig from '../../vitest.config.root.ts'
import { defineConfig, mergeConfig } from 'vitest/config'

export default defineConfig(mergeConfig(globalConfig, {
    resolve: {
        alias: {
            '#src': path.resolve(__dirname, 'dist'),
        }
    }
}))