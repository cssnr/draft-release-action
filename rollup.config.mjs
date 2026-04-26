import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

// noinspection JSUnusedGlobalSymbols
export default {
    input: 'src/index.js',
    output: {
        esModule: true,
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'auto',
    },
    external: [],
    plugins: [
        nodeResolve({
            preferBuiltins: true,
            exportConditions: ['node', 'require', 'default'],
        }),
        commonjs(),
    ],
}
