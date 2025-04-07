/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-12 10:21:16
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 11:28:01
 */
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    environments: {
      browser: true,
      es2021: true,
      node: true, // 启用 Node.js 环境
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'], // 将 @ 映射到 src 目录
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // 根据需要添加文件扩展名
        },
      },
    },
    plugins: {
      prettier: 'eslint-plugin-prettier', // 添加 Prettier 插件
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'off', // 将未使用的变量 忽略
      'react/prop-types': 'off', // 禁用 props 验证
      'prettier/prettier': 'warn', // 将 Prettier 错误设为警告而不是错误
    },
  },
];
