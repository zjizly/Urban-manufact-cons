const tsImportPluginFactory = require('ts-import-plugin');
const rewireMobX = require('react-app-rewire-mobx');
const { getLoader, injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  // MobX
  config = rewireMobX(config, env);
  config = injectBabelPlugin('mobx-async-action', config);

  // ant configuration
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );
  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd',
          style: true,
        }),
      ]
    }),
  };

  // ant design theme
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@info-color": "#7BBAC9",
      "@primary-color": "#4CBECC",
    },
  })(config, env);

  return config;
};