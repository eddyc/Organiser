"use strict"

export default class DatabaseManager {

    constructor(parseFile) {

        this.parseFile = parseFile;
        this.restart(parseFile);
        this.databasePath = "/Users/eddyc/Desktop/database.json";
    }

    restart(parseFile) {
        this.database = require("/Users/eddyc/Desktop/database");

        let chokidar = require("chokidar");
        let paths = this.getFilePaths();
        this.watcher = chokidar.watch(paths, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            usePolling: true
        });

        // Something to use when events are received.
        var log = console.log.bind(console);
        // Add event listeners.
        this.watcher
        .on('add', function(path) {

            parseFile(path, "added");
        })
        .on('change', function(path) {

            console.log("changed");
            parseFile(path, "changed");
        })
        .on('unlink', path => log(`File ${path} has been removed`));


    }

    getFilePaths() {

        let paths = [];

        for (let path in this.database.watched) {

            paths.push(path);
        }

        return paths;
    }

    addFile(filePath) {

        let fs = require("fs");

        this.database.watched[filePath] = {"options":"wtf"};
        const content = JSON.stringify(this.database);
        this.watcher.add(filePath);

        fs.writeFile(this.databasePath, content, 'utf8', function (err) {

            if (err) {
                return console.log(err);
            }
        });
    }

    removeFile(filePath) {

        let fs = require("fs");

        delete this.database.watched[filePath];
        const content = JSON.stringify(this.database);

        let that = this;
        this.watcher.unwatch(filePath);


        fs.writeFile(this.databasePath, content, 'utf8', function (err) {

            if (err) {
                return console.log(err);
            }
        });
    }
}
