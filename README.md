# 智能工厂区块链后台

## 一、项目搭建

### a. 脚手架 [create-react-app](https://github.com/wmonk/create-react-app-typescript)   

项目文档见 [SCAFFOLD.md](./SCAFFOLD.md)

### b. [MobX](https://cn.mobx.js.org)   

由于 create-react-app 未集成 decorator, 需要使用 [rewire](https://github.com/timarney/react-app-rewired#how-to-rewire-your-create-react-app-project) 开启该特性。具体见 [Rewire create-react-app to use MobX](https://github.com/timarney/react-app-rewired/tree/master/packages/react-app-rewire-mobx)。

1. Rewire your create-react-app
   - install package
     ```bash
     npm install react-app-rewired --save-dev
     ```
   - create file `config-overrides.js` in the root dir
     ```js
     module.exports = function override(config, env) {
      //do stuff with the webpack config...
      return config;
     };
     ```
   - refactor npm scripts
     ```diff
     "scripts": {
     -   "start": "react-scripts-ts start",
     +   "start": "react-app-rewired start --scripts-version react-scripts-ts",
     -   "build": "react-scripts-ts build",
     +   "build": "react-app-rewired build --scripts-version react-scripts-ts",
     -   "test": "react-scripts-ts test --env=jsdom",
     +   "test": "react-app-rewired test --scripts-version react-scripts-ts --env=jsdom"
     }
     ```
2. Rewire create-react-app to use MobX
   - install package
     ```bash
     npm install --save mobx mobx-react react-app-rewire-mobx
     ```
   - modify `config-overrides.js`
     ```js
      const rewireMobX = require('react-app-rewire-mobx');

      module.exports = function override(config, env) {
        config = rewireMobX(config, env);
        return config;
      };
     ```

### c. 集成 [Sass](https://github.com/michaelwayman/node-sass-chokidar) 

```bash
npm install --save node-sass-chokidar
```

通过 `npm-run-all` 工具，开启 watcher，详情见 `package.json`。

### d. 路由管理 [react router v4](https://reacttraining.com/react-router/web/guides/philosophy) 

文档见链接，另外有路由守卫 [react-route-guard](https://github.com/pixelfusion/react-route-guard) 。

### e. UI 组件 [Ant Design](http://ant.design/docs/react/introduce-cn) 

主题配色的定制：通过 rewire 修改。



## 二、项目操作

### a. 关于 svn 的文件 ignore

忽略规则放在项目根目录的 `.gitignore` 中，如果往其中添加了规则，记得在项目根目录执行命令

```bash
svn propset svn:global-ignore -F .gitignore .
```
- **注1：** 不要往 `.gitignore` 中写注释，svn 不支持；
- **注2：** `global-ignores` 属性与 `ignore` 属性的区别就在于前者是目录递归的，但要求 svn 版本在 1.8 及其以上。

### b. 项目结构

```
src/
  assets/ ----------- 附件
  components/ ------- 组件
  pages/ ------------ 页面
  stores/ ----------- 状态
  utils/ ------------ 工具
```

