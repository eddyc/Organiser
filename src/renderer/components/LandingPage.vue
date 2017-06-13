<template>



    <md-layout md-gutter >

        <md-card style="width:300px; flex-grow:1; margin:5px" md-flex-xsmall="100" md-flex-small="50" md-flex-medium="25" md-flex-large="33" v-if="value.sections.length > 0"  v-for="(value, propertyName) in state" v-bind:data="propertyName" v-bind:key="value">
            <md-theme md-name="purple">

                <md-card-header>
                    <div class="md-title">{{value.fileName}}</div>
                    <span style="cursor:pointer;
                    word-wrap:break-word; font-size:11px" v-on:click="openFile(value.filePath)" class="md-subhead">{{value.filePath}}</span>

                </md-card-header>
            </md-theme>

            <md-card-content>
                <md-divider></md-divider>
                <div v-for="(section, index) in value.sections">
                    <div v-html="section"></div>

                    <md-divider v-if="index < value.sections.length - 1"></md-divider>

                </div>
            </md-card-content>
        </md-card>

        <md-divider md-inset></md-divider>
    </md-layout>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'

let applicationState = {"null":{"fileName":"null", "filePath":"null", "sections":[]}};

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

        new function () {

            const {shell} = require('electron');
            let counter = 1;
            require('electron').ipcRenderer.on('applicationState', (event, message) => {

                that.state = message;
            });

            require('electron').ipcRenderer.on('notifications', (event, message) => {

                let myNotification = new Notification(message.title, {
                    body: message.body
                })
            });
        };
    }
}


</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

</style>
