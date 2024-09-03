
//  https://bobbyhadz.com/blog/react-you-attempted-to-import-which-falls-outside-project


/*

This stops the below error when try to read a .json file that resides outside of the GitHub folder

Module not found: Error: You attempted to import ../../../../local.secrets.config which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.


*/


module.exports = {
  webpack: {
    configure: webpackConfig => {
      const scopePluginIndex =
        webpackConfig.resolve.plugins.findIndex(
          ({ constructor }) =>
            constructor &&
            constructor.name === 'ModuleScopePlugin',
        );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
  },
  babel: {
    presets: ['@babel/preset-react'],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      return babelLoaderOptions;
    },
  },
};
