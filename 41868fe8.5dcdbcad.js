(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{60:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return i})),n.d(t,"default",(function(){return b}));var a=n(2),r=n(6),o=(n(0),n(76)),c={slug:"react-and-django-in-2020",title:"React and Django in 2020",tags:["react","django"]},l={permalink:"/react-and-django-in-2020",source:"@site/blog/2020-10-22-react-and-django.md",description:"An up to date look at integrating a React frontend into your Django app in 2020.",date:"2020-10-22T00:00:00.000Z",tags:[{label:"react",permalink:"/tags/react"},{label:"django",permalink:"/tags/django"}],title:"React and Django in 2020",readingTime:5.145,truncated:!0,nextItem:{title:"Use webpack-bundle-tracker with Create React App",permalink:"/use-webpack-bundle-tracker-with-create-react-app"}},i=[{value:"Create an app for the React frontend",id:"create-an-app-for-the-react-frontend",children:[]},{value:"Set up Django webpack loader",id:"set-up-django-webpack-loader",children:[]},{value:"Create a view to serve the React app",id:"create-a-view-to-serve-the-react-app",children:[]},{value:"Prod config",id:"prod-config",children:[]},{value:"Live reload config",id:"live-reload-config",children:[]}],p={rightToc:i};function b(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"An up to date look at integrating a React frontend into your Django app in 2020."),Object(o.b)("p",null,"Theres a lot of out of date information about integrating a React frontend with a Django app, and some information which is just plain wrong."),Object(o.b)("p",null,"We will show you how to integrate a React app so that it is served by a Django view."),Object(o.b)("p",null,"Why do it?"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"No reverse proxy needed to serve both apps on the same URL"),Object(o.b)("li",{parentName:"ul"},"Use the built in Django authentication"),Object(o.b)("li",{parentName:"ul"},"Avoid CORS"),Object(o.b)("li",{parentName:"ul"},"Break free from the request-response cycle of Django templates")),Object(o.b)("h2",{id:"create-an-app-for-the-react-frontend"},"Create an app for the React frontend"),Object(o.b)("p",null,"If you haven't already got a project, start a new Django project:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"django-admin startproject foobar\ncd foobar\n")),Object(o.b)("p",null,"Some tutorials suggest initialising the React app in your top level project folder.\nThis is messy.\nWe will create an app within the Django project to hold the React frontend."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"python3 manage.py startapp react_frontend\n")),Object(o.b)("p",null,"We'll use ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/facebook/create-react-app"}),"Create React App")," to set up the React app."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"cd react_frontend\nnpx create-react-app frontend\n")),Object(o.b)("p",null,"You can call the actual React app whatever you like, in this example we just called it ",Object(o.b)("inlineCode",{parentName:"p"},"frontend"),"."),Object(o.b)("p",null,"Once the React app has finished installing, we need to add the ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/owais/webpack-bundle-tracker"}),"webpack-bundle-tracker"),".\nThis will generate a manifest of your frontend app's webpack bundles which will be included in a Django template later."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"cd frontend\nnpm install react-app-rewired webpack-bundle-tracker@0.4.3 --save-dev\n")),Object(o.b)("p",null,"Follow the installation instructions for react-app-rewired to change the scripts in your ",Object(o.b)("inlineCode",{parentName:"p"},"package.json"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-json"}),'...\n  "scripts": {\n    "start": "react-app-rewired start",\n    "build": "react-app-rewired build",\n    "test": "react-app-rewired test",\n    "eject": "react-scripts eject"\n  },\n...\n')),Object(o.b)("p",null,"Create a ",Object(o.b)("inlineCode",{parentName:"p"},"config-overrides.js")," that adds the bundle tracker plugin"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const path = require('path');\nconst BundleTracker = require('webpack-bundle-tracker');\n\nmodule.exports = {\n    webpack: function (config, env) {\n        config.plugins.push(new BundleTracker({\n            path: __dirname,\n            filename: './webpack-stats.json',\n          }),)\n        return config;\n    },\n}\n")),Object(o.b)("p",null,"The final folder structure looks like"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"project_root/\n  foobar/\n    settings.py\n    urls.py\n    ...\n  react_frontend/\n    frontend/\n      package.json\n      webpack-stats.json\n      ...\n    views.py\n    ...\n")),Object(o.b)("p",null,"It doesn't really matter how you organise the React + Django project, but we think its neat to have everything contained in an app."),Object(o.b)("h2",{id:"set-up-django-webpack-loader"},"Set up Django webpack loader"),Object(o.b)("p",null,"In order to include the webpack files in the Django app, we'll need to install ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://github.com/owais/django-webpack-loader"}),"django-webpack-loader"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"pip3 install django-webpack-loader --user\n")),Object(o.b)("p",null,"Add it to the installed apps in ",Object(o.b)("inlineCode",{parentName:"p"},"project_root/foobar/settings.py"),"."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"INSTALLED_APPS = [\n    ...\n    'webpack_loader',\n    ...\n]\n")),Object(o.b)("p",null,"If you've followed the same project structure as above, also in ",Object(o.b)("inlineCode",{parentName:"p"},"settings.py")," configure the loader"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"WEBPACK_LOADER = {\n    'DEFAULT': {\n        'STATS_FILE': os.path.join(BASE_DIR, 'react_frontend/frontend/webpack-stats.json'),\n    }\n}\n\nSTATICFILES_DIRS = [\n    os.path.join(BASE_DIR, 'react_frontend/frontend/build/static/'),\n]\n")),Object(o.b)("p",null,"What do these options mean?"),Object(o.b)("ol",null,Object(o.b)("li",{parentName:"ol"},"The webpack-bundle-tracker we installed in the React app is responsible for generating ",Object(o.b)("inlineCode",{parentName:"li"},"webpack-stats.json"),". The first config option sets the path to the stats file."),Object(o.b)("li",{parentName:"ol"},"When you run ",Object(o.b)("inlineCode",{parentName:"li"},"yarn build")," inside the React app, it will generate the production assets. The second config options adds the build directory to the list of directories where Django will serve static assets from.")),Object(o.b)("h2",{id:"create-a-view-to-serve-the-react-app"},"Create a view to serve the React app"),Object(o.b)("p",null,"The files below configure a template view in the project to render an HTML page containing a root div where the React app will be attached."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-python"}),"# react_frontend/views.py\n\nfrom django.views.generic import TemplateView\nfrom django.conf import settings\n\n\nclass Index(TemplateView):\n    template_name = 'react_frontend/index.html'\n")),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-html"}),'# react_frontend/templates/react_frontend/index.html\n\n<!doctype html>\n<html lang="en">\n<head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width,initial-scale=1" />\n    <title>React App</title>\n</head>\n<body><noscript>You need to enable JavaScript to run this app.</noscript>\n    <div id="root"></div>\n</body>\n</html>\n')),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-python"}),"# react_frontend/urls.py\n\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path('', views.Index.as_view()),\n]\n")),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-python"}),"# foobar/urls.py\n\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path('admin/', admin.site.urls),\n    path('', include('react_frontend.urls')),\n]\n")),Object(o.b)("h2",{id:"prod-config"},"Prod config"),Object(o.b)("p",null,"Still in the ",Object(o.b)("inlineCode",{parentName:"p"},"$project/react_frontend/frontend")," directory, build the production assets and check that the ",Object(o.b)("inlineCode",{parentName:"p"},"webpack-stats.json")," file has been created."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"yarn build\n")),Object(o.b)("p",null,"Update the template for our index view to include the bundles"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-html"}),"{% load render_bundle from webpack_loader %}\n\n<!doctype html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />\n    <title>React App</title>\n    {% render_bundle 'main' 'css' %}\n</head>\n<body><noscript>You need to enable JavaScript to run this app.</noscript>\n    <div id=\"root\"></div>\n    {% render_bundle 'runtime-main' 'js' %}\n    {% render_bundle 'undefined' 'js' %}\n    {% render_bundle 'main' 'js' %}\n</body>\n</html>\n")),Object(o.b)("p",null,"Inspect the ",Object(o.b)("inlineCode",{parentName:"p"},"webpack-stats.json")," file to identify the bundle names you need to include.\nYou can also look at the index.html file that CRA has generated to determine the order in which to include them."),Object(o.b)("p",null,"Now all thats left to do is make sure the frontend app is listed in ",Object(o.b)("inlineCode",{parentName:"p"},"settings.py"),":"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-python"}),"INSTALLED_APPS = [\n    ...\n    'react_frontend',\n    ...\n]\n")),Object(o.b)("p",null,"And start up the Django server from the root of the project:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{}),"python3 manage.py runserver\n")),Object(o.b)("h2",{id:"live-reload-config"},"Live reload config"),Object(o.b)("p",null,"The prod config is fine but you have to run ",Object(o.b)("inlineCode",{parentName:"p"},"yarn build")," whenever you make changes to the React app, and then refresh the page in the browser."),Object(o.b)("p",null,"When you run ",Object(o.b)("inlineCode",{parentName:"p"},"yarn start")," in the React project, the development server doesn't write the bundle files but just serves them from memory."),Object(o.b)("p",null,"Instead of including the bundles from static files, we can just link to them directory from the development server."),Object(o.b)("p",null,"We need to make the following changes to the webpack config in ",Object(o.b)("inlineCode",{parentName:"p"},"config-overrides.js"),":"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Prepend the dev server URL to the bundle output path"),Object(o.b)("li",{parentName:"ul"},"Tell the HMR client to connect to the dev server instead of looking for the reload websocket in the Django web server"),Object(o.b)("li",{parentName:"ul"},"Add the CORS headers for the dev server so that the Django hosted React app can load the hot reload fragments")),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),"const path = require('path');\nconst BundleTracker = require('webpack-bundle-tracker');\n\nmodule.exports = {\n    webpack: function (config, env) {\n        if (config.mode == 'development') {\n            config.output.publicPath = 'http://localhost:3000/';\n            config.entry = ['webpack-dev-server/client?http://localhost:3000', config.entry];\n        }\n        config.plugins.push(new BundleTracker({\n            path: __dirname,\n            filename: './webpack-stats.json',\n        }))\n        return config;\n    },\n    devServer: function (configFunction) {\n        return function (proxy, allowedHost) {\n            const config = configFunction(proxy, allowedHost);\n            config.headers = {\n                \"Access-Control-Allow-Origin\": \"*\"\n            }\n            return config;\n        }\n    }\n}\n")),Object(o.b)("p",null,"At this point if you have both the Django and React development servers running, you'll get the React app served correctly from inside Django and connected to the live reload websocket."))}b.isMDXComponent=!0}}]);