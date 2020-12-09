---
slug: simple-react-sqlite-migrations
title: Simple React SQLite migrations
tags: [react, react-native, sqlite, database, sql, migrations]
---

Reviewing a simple pattern for handling SQLite database migrations in a React Native application, updated to use async/await

<!-- truncate -->

There are a few places online that refer to a pattern for implementing migrations using SQLite, but if you've never done it before it might not be so obvious.

- https://github.com/andpor/react-native-sqlite-storage/issues/264
- https://gist.github.com/spruce-bruce/97ed3d0fddab3a93082b71c228c7e5a8

Stripping this down to the basics, the idea is

1. Save a number somwhere which represents the current version level of the database
2. Have an array of sql statements - the migrations
3. If `current version < migrations.length`, start at the array index of the current version and execute the migrations sequentially until the end of the array, incrementing the current version each time

In the example below the logic is built into a _DatabaseService_ class but you could structure the code however you want, e.g., in a provider using the Context API.

SQLite has the user version pragma, and some libraries expose a version get/set function, but why not just store it in a table?

```javascript
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

export class DatabaseService {
    constructor() {
        SQLite.openDatabase({ name: 'LocalDatabase.db', location: 'default' }).then(async (db) => {
            this.db = db;
            await this.init();
        })
    }

    async init() {
        let [result] = await this.db.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name=:name", ['version']);
        if (!result.rows.length) {
            await this.db.transaction((tx) => {
                tx.executeSql('CREATE TABLE IF NOT EXISTS version (version INTEGER)');
                tx.executeSql('CREATE INDEX IF NOT EXISTS version_idx ON version (version);');
                tx.executeSql('INSERT INTO version (version) VALUES (:version)', [0]);
            })
        }
    }

    async getVersion() {
        let [result] = await this.db.executeSql('SELECT version FROM version LIMIT 1');
        return result.rows.item(0).version;
    }

}
```

The init function should be run first to create the version table if it doesn't exist and set it to zero.
In this example we did that in the constructur after the database has been opened (we used promise here as class constructor cannot be an async method).

`getVersion()` is just a convenience to get the current version from the table.

The migrations are defined simply as an array of strings.
Each string contains the SQL statements to execute for that migration.

```javascript
const migrations = [
    `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            last_updated TEXT NOT NULL
        );
    `,
    `
        CREATE TABLE IF NOT EXISTS nodes (
            id TEXT PRIMARY KEY,
            name TEXT,
            last_updated TEXT NOT NULL
        );
    `
]

export default migrations;
```

This looks a bit funky with the backtick multiline strings - format to taste.

The migrations are included in the service and we'll add a migrate function to process them:

```javascript
import SQLite from 'react-native-sqlite-storage';
import migrations from './Migrations';
SQLite.enablePromise(true);

export class DatabaseService {
    
    ...

    async migrate() {
        const currentVersion = await this.getVersion();
        console.log(`current db version is ${currentVersion}, latest migration ${migrations.length}`)

        if(currentVersion < migrations.length) {
            for (let i = currentVersion; i < migrations.length; i++) {
                const migration = migrations[i];
                console.log(`running migration ${i+1}`)
                await this.db.transaction((tx) => {
                    tx.executeSql(migration);
                    tx.executeSql("UPDATE version SET version = :version", [i+1]);
                })
            }
            const newVersion = await this.getVersion()
            console.log(`new db version is ${newVersion}`)
        }
    }

}
```

This gets the current version using the function defined earlier from the version table.

The starting index for looping over the migrations array is set to the current version.
This means that old migrations are not executed again.

In a transaction we execute the SQL statement for the migration and update the database version.

We set the version on each loop iteration so that if a particular migration fails it will start from the correct one next time the migrate function is invoked.

The initial state of the database before any migrations have been run is represented by version = 0.
However, the index of the first migration is also 0.
So in the loop for executing migrations we actually store the version as `i+1`.

----

So there you have it, a naive but simple approach to migrations to SQLite in a Javascript / React app.

It's by no means full featured but do you really need much more?

If you need things like the ability to undo migrations, think about how practical that would be in a mobile setting.