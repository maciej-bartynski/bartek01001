import path from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'
import globalConfig from '../../vitest.config.root.ts'

export default defineConfig(mergeConfig(globalConfig, {
    resolve: {
        alias: {
            '#src': path.resolve(__dirname, 'dist'),
        }
    }
}))