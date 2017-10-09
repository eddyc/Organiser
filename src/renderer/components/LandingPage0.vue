<template>
    <md-layout md-gutter >
        <md-layout id="sortable">
            <md-card style="width:350px; max-width:500px; flex-grow:1; margin:5px" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="25" md-flex-large="33" v-for="note in state" v-bind:key="note.key">
                <md-card-header>
                    <div class="md-title">{{note.data.fileName}}</div>
                    <span style="cursor:pointer; word-wrap:break-word; font-size:11px" v-on:click="openFile(note.data.filePath)" class="md-subhead">{{note.data.filePath}}</span>
                </md-card-header>

                <md-card-content>
                    <md-divider></md-divider>
                    <div v-for="(section, index) in note.data.sections">
                        <div v-html="section" class="section"></div>

                        <md-divider v-if="index < note.data.sections.length - 1"></md-divider>

                    </div>
                </md-card-content>
            </md-card>
        </md-layout>

        <md-divider md-inset></md-divider>
    </md-layout>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
import Sortable from 'sortablejs'

let applicationState = [{"key":0, "data":{"fileName":"null", "filePath":"null", "sections":[]}}];


Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};


export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
        open (link) {
            this.$electron.shell.openExternal(link)
        },
        openFile(filePath) {
            const {shell} = require('electron');
            console.log(filePath);
            shell.openExternal("file://" + filePath);
        }
    },
    data() {
        return {
            state: applicationState
        }
    },
    mounted: function() {

        let that = this;

        new function () {

            const {shell} = require('electron');
            const {ipcRenderer} = require('electron');

            let counter = 1;
            require('electron').ipcRenderer.on('applicationState', (event, message) => {

                that.state = message;
            });

            require('electron').ipcRenderer.on('notifications', (event, message) => {

                let myNotification = new Notification(message.title, {
                    body: message.body
                })
            });

            Sortable.create(document.getElementById("sortable"),{

                onUpdate: function (event) {

                    that.state.move(event.oldIndex,event.newIndex);
                    ipcRenderer.send('reorder', that.state);
                    console.log(that.state);

                }
            });
        };
    }
}

</script>

<style src="highlight.js/styles/monokai.css">
</style>
<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
body.md-theme-default {

    background: #4e4e4e;
}

pre {

    background: black;
    white-space: pre-wrap;
    padding:5px;
    border-radius:4px;
    font-weight: bold;
    overflow: scroll;
}

.md-theme-default code:not(.hljs) {

    background-color:rgba(0, 0, 0, 0);
    color:white;
}

</style>
