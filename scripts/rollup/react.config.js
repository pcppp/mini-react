import generatePackageJson from 'rollup-plugin-generate-package-json';
import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils';
import { version } from 'typescript';
const { name, module } = getPackageJSON('react');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);
export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'React',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
        }),
      }),
    ],
  },
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime',
        format: 'umd',
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime',
        format: 'umd',
      },
    ],
    plugins: getBaseRollupPlugins(),
  },
];
