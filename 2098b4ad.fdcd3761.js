(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{56:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return o})),n.d(t,"rightToc",(function(){return s})),n.d(t,"default",(function(){return c}));var a=n(2),r=(n(0),n(85));const i={slug:"simple-react-sqlite-migrations",title:"Simple React SQLite migrations",tags:["react","react-native","sqlite","database","sql","migrations"]},o={permalink:"/simple-react-sqlite-migrations",source:"@site/blog/2020-12-09-simple-react-sqlite-migrations.md",description:"Reviewing a simple pattern for handling SQLite database migrations in a React Native application, updated to use async/await",date:"2020-12-09T00:00:00.000Z",tags:[{label:"react",permalink:"/tags/react"},{label:"react-native",permalink:"/tags/react-native"},{label:"sqlite",permalink:"/tags/sqlite"},{label:"database",permalink:"/tags/database"},{label:"sql",permalink:"/tags/sql"},{label:"migrations",permalink:"/tags/migrations"}],title:"Simple React SQLite migrations",readingTime:3.455,truncated:!0,nextItem:{title:"Tips for secure Django Graphene",permalink:"/tips-for-secure-django-graphene"}},s=[],l={rightToc:s};function c({components:e,...t}){return Object(r.b)("wrapper",Object(a.a)({},l,t,{components:e,mdxType:"MDXLayout"}),Object(r.b)("p",null,"Reviewing a simple pattern for handling SQLite database migrations in a React Native application, updated to use async/await"),Object(r.b)("p",null,"There are a few places online that refer to a pattern for implementing migrations using SQLite, but if you've never done it before it might not be so obvious."),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"https://github.com/andpor/react-native-sqlite-storage/issues/264"}),"https://github.com/andpor/react-native-sqlite-storage/issues/264")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(a.a)({parentName:"li"},{href:"https://gist.github.com/spruce-bruce/97ed3d0fddab3a93082b71c228c7e5a8"}),"https://gist.github.com/spruce-bruce/97ed3d0fddab3a93082b71c228c7e5a8"))),Object(r.b)("p",null,"Stripping this down to the basics, the idea is"),Object(r.b)("ol",null,Object(r.b)("li",{parentName:"ol"},"Save a number somwhere which represents the current version level of the database"),Object(r.b)("li",{parentName:"ol"},"Have an array of sql statements - the migrations"),Object(r.b)("li",{parentName:"ol"},"If ",Object(r.b)("inlineCode",{parentName:"li"},"current version < migrations.length"),", start at the array index of the current version and execute the migrations sequentially until the end of the array, incrementing the current version each time")),Object(r.b)("p",null,"In the example below the logic is built into a ",Object(r.b)("em",{parentName:"p"},"DatabaseService")," class but you could structure the code however you want, e.g., in a provider using the Context API."),Object(r.b)("p",null,"SQLite has the user version pragma, and some libraries expose a version get/set function, but why not just store it in a table?"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"import SQLite from 'react-native-sqlite-storage';\nSQLite.enablePromise(true);\n\nexport class DatabaseService {\n    constructor() {\n        SQLite.openDatabase({ name: 'LocalDatabase.db', location: 'default' }).then(async (db) => {\n            this.db = db;\n            await this.init();\n        })\n    }\n\n    async init() {\n        let [result] = await this.db.executeSql(\"SELECT name FROM sqlite_master WHERE type='table' AND name=:name\", ['version']);\n        if (!result.rows.length) {\n            await this.db.transaction((tx) => {\n                tx.executeSql('CREATE TABLE IF NOT EXISTS version (version INTEGER)');\n                tx.executeSql('CREATE INDEX IF NOT EXISTS version_idx ON version (version);');\n                tx.executeSql('INSERT INTO version (version) VALUES (:version)', [0]);\n            })\n        }\n    }\n\n    async getVersion() {\n        let [result] = await this.db.executeSql('SELECT version FROM version LIMIT 1');\n        return result.rows.item(0).version;\n    }\n\n}\n")),Object(r.b)("p",null,"The init function should be run first to create the version table if it doesn't exist and set it to zero.\nIn this example we did that in the constructur after the database has been opened (we used promise here as class constructor cannot be an async method)."),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"getVersion()")," is just a convenience to get the current version from the table."),Object(r.b)("p",null,"The migrations are defined simply as an array of strings.\nEach string contains the SQL statements to execute for that migration."),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"const migrations = [\n    `\n        CREATE TABLE IF NOT EXISTS users (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL,\n            last_updated TEXT NOT NULL\n        );\n    `,\n    `\n        CREATE TABLE IF NOT EXISTS nodes (\n            id TEXT PRIMARY KEY,\n            name TEXT,\n            last_updated TEXT NOT NULL\n        );\n    `\n]\n\nexport default migrations;\n")),Object(r.b)("p",null,"This looks a bit funky with the backtick multiline strings - format to taste."),Object(r.b)("p",null,"The migrations are included in the service and we'll add a migrate function to process them:"),Object(r.b)("pre",null,Object(r.b)("code",Object(a.a)({parentName:"pre"},{className:"language-javascript"}),"import SQLite from 'react-native-sqlite-storage';\nimport migrations from './Migrations';\nSQLite.enablePromise(true);\n\nexport class DatabaseService {\n    \n    ...\n\n    async migrate() {\n        const currentVersion = await this.getVersion();\n        console.log(`current db version is ${currentVersion}, latest migration ${migrations.length}`)\n\n        if(currentVersion < migrations.length) {\n            for (let i = currentVersion; i < migrations.length; i++) {\n                const migration = migrations[i];\n                console.log(`running migration ${i+1}`)\n                await this.db.transaction((tx) => {\n                    tx.executeSql(migration);\n                    tx.executeSql(\"UPDATE version SET version = :version\", [i+1]);\n                })\n            }\n            const newVersion = await this.getVersion()\n            console.log(`new db version is ${newVersion}`)\n        }\n    }\n\n}\n")),Object(r.b)("p",null,"This gets the current version using the function defined earlier from the version table."),Object(r.b)("p",null,"The starting index for looping over the migrations array is set to the current version.\nThis means that old migrations are not executed again."),Object(r.b)("p",null,"In a transaction we execute the SQL statement for the migration and update the database version."),Object(r.b)("p",null,"We set the version on each loop iteration so that if a particular migration fails it will start from the correct one next time the migrate function is invoked."),Object(r.b)("p",null,"The initial state of the database before any migrations have been run is represented by version = 0.\nHowever, the index of the first migration is also 0.\nSo in the loop for executing migrations we actually store the version as ",Object(r.b)("inlineCode",{parentName:"p"},"i+1"),"."),Object(r.b)("hr",null),Object(r.b)("p",null,"So there you have it, a naive but simple approach to migrations to SQLite in a Javascript / React app."),Object(r.b)("p",null,"It's by no means full featured but do you really need much more?"),Object(r.b)("p",null,"If you need things like the ability to undo migrations, think about how practical that would be in a mobile setting."))}c.isMDXComponent=!0},85:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return g}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=r.a.createContext({}),u=function(e){var t=r.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},b=function(e){var t=u(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),b=u(n),m=a,g=b["".concat(o,".").concat(m)]||b[m]||p[m]||i;return n?r.a.createElement(g,s(s({ref:t},c),{},{components:n})):r.a.createElement(g,s({ref:t},c))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);