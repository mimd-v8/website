---
slug: use-webpack-bundle-tracker-with-create-react-app
title: Use webpack-bundle-tracker with Create React App
tags: [react, cra, webpack, django]
---

[webpack-bundle-tracker](https://github.com/owais/webpack-bundle-tracker) is essential for integrating a React App with Django.
Can we use it with Create React App without having to eject?

<!-- truncate -->

Create your app using CRA as normal

```
npx create-react-app helloworld
```

Install [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) as well as the bundle tracker

```
npm install react-app-rewired webpack-bundle-tracker@0.4.3 --save-dev
```

Follow the installation instructions for react-app-rewired to change the scripts in your `package.json`:

```json
...
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
...
```

Create a `config-overrides.js` that adds the bundle tracker plugin

```js
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    webpack: function (config, env) {
        config.plugins.push(new BundleTracker({
            path: __dirname,
            filename: './webpack-stats.json',
          }),)
        return config;
    },
}
```

Now when you start the development server or run a production build, you'll find the `webpack-stats.json` file generated at the project root.