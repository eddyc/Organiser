"use strict"

import DatabaseManager from "./DatabaseManager";
import Calendar from "./Calendar";
import Parser from "./Parser";
import getActiveWindow from "./ActiveWindow";
const {globalShortcut, ipcMain} = require('electron');

export default class Organiser {

    constructor(mainWindow) {

        let that = this;
        this.mainWindow = mainWindow;
        this.state = [];
        this.databaseManager = new DatabaseManager(this.parseFile.bind(this));
        this.calendar = new Calendar();

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

        new function() {

            ipcMain.on('reorder', (event, state) => {

                let order = [];

                for (let i = 0; i < state.length; ++i) {

                    order.push(state[i].key);
                }
                that.state = [];
                that.databaseManager.reorderData(order);
            });

        }
    }

    parseFile(path, reason) {

        let data = this.parser.parseFile(path);

        for (let i = 0; i < this.state.length; i++) {

            if (this.state[i].data.filePath === path) {

                this.state[i].data = data;
                this.mainWindow.webContents.send('applicationState', this.state);
                return;
            }
        }

        this.state.push({"key":this.state.length, "data": data});
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
                this.state = [];
                this.databaseManager.removeFile(path);
                this.mainWindow.webContents.send('notifications', {"title": "File removed", "body":path});
            }
        });
    }
}
