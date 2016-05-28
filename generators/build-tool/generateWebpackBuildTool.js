import { set } from 'lodash';
import { getModule, replaceCodeMemory, addNpmScriptMemory, addNpmPackageMemory } from '../utils';

export default async function genereateWebpackBuildTool(params) {
  set(params, ['build', 'webpack.config.js'], await getModule('build-tool/webpack/webpack.config.js'));

  await addNpmScriptMemory('build', 'webpack', params);
  await addNpmScriptMemory('postinstall', 'build', params);
  await addNpmPackageMemory('webpack', params, true);
  await addNpmPackageMemory('webpack-hot-middleware', params, true);
  await addNpmPackageMemory('babel-core', params, true);
  await addNpmPackageMemory('babel-loader', params, true);
  await addNpmPackageMemory('babel-preset-es2015', params, true);

  switch (params.framework) {
    case 'express':
      await replaceCodeMemory(params, 'server.js', 'WEBPACK_REQUIRE', await getModule('build-tool/webpack/webpack-require.js'));
      await replaceCodeMemory(params, 'server.js', 'WEBPACK_COMPILER', await getModule('build-tool/webpack/webpack-compiler.js'));
      await replaceCodeMemory(params, 'server.js', 'WEBPACK_MIDDLEWARE', await getModule('build-tool/webpack/webpack-middleware.js'));
      break;
    case 'meteor':
      break;
    default:
      break;
  }

  switch (params.cssPreprocessor) {
    case 'sass':
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE_REQUIRE', await getModule('build-tool/none/sass-middleware-require.js'));
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE', await getModule('build-tool/none/sass-middleware.js'));
      await addNpmPackageMemory('node-sass-middleware', params);
      break;
    case 'less':
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE_REQUIRE', await getModule('build-tool/none/less-middleware-require.js'));
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE', await getModule('build-tool/none/less-middleware.js'));
      await addNpmPackageMemory('less-middleware', params);
      break;
    case 'postcss':
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE_REQUIRE', await getModule('build-tool/none/postcss-middleware-require.js'));
      await replaceCodeMemory(params, 'server.js', 'CSS_PREPROCESSOR_MIDDLEWARE', await getModule('build-tool/none/postcss-middleware.js'));
      await addNpmPackageMemory('postcss-middleware', params);
      break;
    default:
      break;
  }

  switch (params.jsFramework) {
    case 'react':
      await replaceCodeMemory(params, 'webpack.config.js', 'WEBPACK_JAVASCRIPT_LOADER', await getModule('build-tool/webpack/webpack-react-loader.js'));
      await addNpmPackageMemory('babel-plugin-react-transform', params, true);
      await addNpmPackageMemory('react-transform-hmr', params, true);
      await addNpmPackageMemory('babel-preset-react', params, true);
      break;
    case 'angularjs':
      break;
    default:
      await replaceCodeMemory(params, 'webpack.config.js', 'WEBPACK_JAVASCRIPT_LOADER', await getModule('build-tool/webpack/webpack-vanillajs-loader.js'));
      break;
  }
}
