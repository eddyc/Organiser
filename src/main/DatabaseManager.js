"use strict"

export default class DatabaseManager {

    constructor(parseFile) {

        this.chokidar = require("chokidar");
        this.parseFile = parseFile;
        this.restart(parseFile);

    }

    ensureDirectoryExistence(filePath) {

        let path = require('path');
        let fs = require('fs');
        let dirname = path.dirname(filePath);
        const {app} = require('electron')


        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    restart(parseFile) {

        const {app} = require('electron')

        let path = require('path');
        let fs = require('fs');
        let homeDirectory = app.getPath("home");
        this.databasePath = homeDirectory + "/.organiser/database.json";

        let exists = this.ensureDirectoryExistence(this.databasePath);


        exists = fs.existsSync(this.databasePath);

        if (exists === false) {

            let data = {"watched":[]};
            const content = JSON.stringify(data);

            fs.writeFileSync(this.databasePath, content, 'utf8');
        }

        let content = fs.readFileSync(this.databasePath, 'utf8');
        this.database = JSON.parse(fs.readFileSync(this.databasePath, 'utf8'));

        console.log(this.database);

        let paths = this.getFilePaths();
        this.watcher = this.chokidar.watch(paths, {
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

            console.log("changed" + path);
            parseFile(path, "changed");
        })
        .on('unlink', path => log(`File ${path} has been removed`));


    }

    getFilePaths() {

        let paths = [];

        for (let i = 0; i < this.database.watched.length; ++i) {

            paths.push(this.database.watched[i].path);
        }

        return paths;
    }

    addFile(filePath) {

        for (let i = 0; i < this.database.watched.length; ++i) {

            if (this.database.watched[i].path === filePath) {

                return;
            }
        }

        let fs = require("fs");

        this.database.watched.push({"path":filePath, "options":"wtf"});
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

        for (let i = 0; i < this.database.watched.length; ++i) {

            if (this.database.watched[i].path === filePath) {

                this.database.watched.splice(i, 1);
            }
        }

        const content = JSON.stringify(this.database);

        let that = this;

        fs.writeFile(this.databasePath, content, 'utf8', function (err) {

            that.watcher.close();
            that.restart(that.parseFile);

            if (err) {
                return console.log(err);
            }
        });
    }

    reorderData(order) {

        console.log(order);
        console.log(this.database);

        let watched = []
        for (let i = 0; i < order.length; ++i) {

            watched.push(this.database.watched[order[i]]);
        }

        this.database.watched = watched;

        const content = JSON.stringify(this.database);

        let that = this;

        let fs = require("fs");

        fs.writeFile(this.databasePath, content, 'utf8', function (err) {

            that.watcher.close();
            that.restart(that.parseFile);

            if (err) {
                return console.log(err);
            }
        });
    }
}
