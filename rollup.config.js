import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';

const dev = process.env.NODE_ENV !== 'production';
const output = process.env.NODE_ENV !== 'production' ? '_dev' : '_site';

export default [
    {
        input: 'src/_bundle/css.js',
        output: [
            {
                file: '.cache/css.js',
            },
        ],
        plugins: [
            replace({
                DEV_MODE: dev,
            }),
            /* Generates a cached file with all CSS,
        /  which will be used later to purge & add only the CSS used
        /  on each individual page. */
            postcss({
                extract: '.cache/main.css',
                // inject: true,
                // minimize: !dev,
            }),
            commonjs(),
            dev && terser(),
        ],
        watch: {
            include: ['src/_bundle/css/**'],
            clearScreen: false,
        },
    },
    {
        input: 'src/_bundle/carbon-badge/index.js',
        output: [
            { file: `${output}/js/carbon-badge.mjs`, format: 'es' },
            { file: `${output}/js/carbon-badge.js`, format: 'umd', name: '1.0.0' },
        ],
        plugins: [
            svelte(),
            resolve({
                browser: true,
                dedupe: ['svelte'],
            }),
            commonjs(),

            babel({
                extensions: ['.js', '.mjs', '.html', '.svelte'],
                babelHelpers: 'runtime',
                exclude: ['node_modules/@babel/**'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: '> 0.25%, not dead',
                        },
                    ],
                ],
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    [
                        '@babel/plugin-transform-runtime',
                        {
                            useESModules: true,
                        },
                    ],
                ],
            }),

            !dev &&
                terser({
                    module: true,
                }),
        ],
    },
];
