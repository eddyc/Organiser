"use strict"

import DatabaseManager from "./DatabaseManager";
import Calendar from "./Calendar";
import Parser from "./Parser";
import getActiveWindow from "./ActiveWindow";
const {globalShortcut} = require('electron')

export default class Organiser {

    constructor(mainWindow) {

        this.mainWindow = mainWindow;
        this.state = {};
        this.databaseManager = new DatabaseManager(this.parseFile.bind(this));
        this.calendar = new Calendar();
        this.activeWindow = require('active-window');

        this.mainWindow.webContents.on('did-finish-load', () => {

            this.mainWindow.webContents.send('applicationState', this.state);
        });

        const ret = globalShortcut.register('Command+Control+N', () => {

            this.addFileToDatabase();
        })

        globalShortcut.register('Command+Control+M', () => {

            this.removeFileFromDatabase();
        })

        if (!ret) {
            console.log('registration failed')
        }

        this.parser = new Parser("====");

    }

    parseFile(path, reason) {

        let sections = this.parser.parseFile(path);
        this.state[path] = sections;
        console.log("parse");
        this.mainWindow.webContents.send('applicationState', this.state);
    }

    addFileToDatabase() {

        getActiveWindow(window => {

            if (window.title.includes("file://")) {


                let path = window.title.split("file://")[1];
                path = path.replace("%20", " ")
                this.databaseManager.addFile(path);
                this.mainWindow.webContents.send('notifications', {"title": "File Added", "body":path});
            }
        });
    }

    removeFileFromDatabase() {

        console.log("remove");
        getActiveWindow(window => {

            if (window.title.includes("file://")) {

                let path = window.title.split("file://")[1];
                path = path.replace("%20", " ")
                this.databaseManager.removeFile(path);
                this.mainWindow.webContents.send('notifications', {"title": "File removed", "body":path});
                delete this.state[path];
                this.mainWindow.webContents.send('applicationState', this.state);

            }
        });
    }
}
