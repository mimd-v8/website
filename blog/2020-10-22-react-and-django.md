---
slug: react-and-django-in-2020
title: React and Django in 2020
tags: [react, django]
---

An up to date look at integrating a React frontend into your Django app in 2020.

<!-- truncate -->

Theres a lot of out of date information about integrating a React frontend with a Django app, and some information which is just plain wrong.

We will show you how to integrate a React app so that it is served by a Django view.
 
Why do it?

- No reverse proxy needed to serve both apps on the same URL
- Use the built in Django authentication
- Avoid CORS
- Break free from the request-response cycle of Django templates

## Create an app for the React frontend

If you haven't already got a project, start a new Django project:

```
django-admin startproject foobar
cd foobar
```

Some tutorials suggest initialising the React app in your top level project folder.
This is messy.
We will create an app within the Django project to hold the React frontend.

```
python3 manage.py startapp react_frontend
```

We'll use [Create React App](https://github.com/facebook/create-react-app) to set up the React app.

```
cd react_frontend
npx create-react-app frontend
```

You can call the actual React app whatever you like, in this example we just called it `frontend`.

Once the React app has finished installing, we need to add the [webpack-bundle-tracker](https://github.com/owais/webpack-bundle-tracker).
This will generate a manifest of your frontend app's webpack bundles which will be included in a Django template later.

```
cd frontend
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

The final folder structure looks like

```
project_root/
  foobar/
    settings.py
    urls.py
    ...
  react_frontend/
    frontend/
      package.json
      webpack-stats.json
      ...
    views.py
    ...
```

It doesn't really matter how you organise the React + Django project, but we think its neat to have everything contained in an app.

## Set up Django webpack loader

In order to include the webpack files in the Django app, we'll need to install [django-webpack-loader](https://github.com/owais/django-webpack-loader).

```
pip3 install django-webpack-loader --user
```

Add it to the installed apps in `project_root/foobar/settings.py`.

```
INSTALLED_APPS = [
    ...
    'webpack_loader',
    ...
]
```

If you've followed the same project structure as above, also in `settings.py` configure the loader

```
WEBPACK_LOADER = {
    'DEFAULT': {
        'STATS_FILE': os.path.join(BASE_DIR, 'react_frontend/frontend/webpack-stats.json'),
    }
}

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'react_frontend/frontend/build/static/'),
]
```

What do these options mean?

1. The webpack-bundle-tracker we installed in the React app is responsible for generating `webpack-stats.json`. The first config option sets the path to the stats file.
2. When you run `yarn build` inside the React app, it will generate the production assets. The second config options adds the build directory to the list of directories where Django will serve static assets from.

## Create a view to serve the React app

The files below configure a template view in the project to render an HTML page containing a root div where the React app will be attached.

```python
# react_frontend/views.py

from django.views.generic import TemplateView
from django.conf import settings


class Index(TemplateView):
    template_name = 'react_frontend/index.html'
```

```html
# react_frontend/templates/react_frontend/index.html

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>React App</title>
</head>
<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
</body>
</html>
```

```python
# react_frontend/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.Index.as_view()),
]
```

```python
# foobar/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('react_frontend.urls')),
]
```


## Prod config


Still in the `$project/react_frontend/frontend` directory, build the production assets and check that the `webpack-stats.json` file has been created.

```
yarn build
```

Update the template for our index view to include the bundles

```html
{% load render_bundle from webpack_loader %}

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>React App</title>
    {% render_bundle 'main' 'css' %}
</head>
<body><noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    {% render_bundle 'runtime-main' 'js' %}
    {% render_bundle 'undefined' 'js' %}
    {% render_bundle 'main' 'js' %}
</body>
</html>
```

Inspect the `webpack-stats.json` file to identify the bundle names you need to include.
You can also look at the index.html file that CRA has generated to determine the order in which to include them.

Now all thats left to do is make sure the frontend app is listed in `settings.py`:

```python
INSTALLED_APPS = [
    ...
    'react_frontend',
    ...
]
```

And start up the Django server from the root of the project:

```
python3 manage.py runserver
```

## Live reload config

The prod config is fine but you have to run `yarn build` whenever you make changes to the React app, and then refresh the page in the browser.

When you run `yarn start` in the React project, the development server doesn't write the bundle files but just serves them from memory.

Instead of including the bundles from static files, we can just link to them directory from the development server.

We need to make the following changes to the webpack config in `config-overrides.js`:

- Prepend the dev server URL to the bundle output path
- Tell the HMR client to connect to the dev server instead of looking for the reload websocket in the Django web server
- Add the CORS headers for the dev server so that the Django hosted React app can load the hot reload fragments

```js
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    webpack: function (config, env) {
        if (config.mode == 'development') {
            config.output.publicPath = 'http://localhost:3000/';
            config.entry = ['webpack-dev-server/client?http://localhost:3000', config.entry];
        }
        config.plugins.push(new BundleTracker({
            path: __dirname,
            filename: './webpack-stats.json',
        }))
        return config;
    },
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);
            config.headers = {
                "Access-Control-Allow-Origin": "*"
            }
            return config;
        }
    }
}
```

At this point if you have both the Django and React development servers running, you'll get the React app served correctly from inside Django and connected to the live reload websocket.

