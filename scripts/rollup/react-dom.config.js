import generatePackageJson from 'rollup-plugin-generate-package-json';
import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils';
import alias from '@rollup/plugin-alias';

const { name, module } = getPackageJSON('react-dom');
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);
export default [
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      format: 'umd',
    },
    plugins: [
      ...getBaseRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          peerDependencies: {
            react: version,
          },
          main: 'index.js',
        }),
      }),
    ],
  },
];
