<template>
    <v-app id="example-2">
        <!-- <v-navigation-drawer persistent light :mini-variant.sync="mini" v-model="drawer">
        <v-list class="pa-0">
        <v-list-item>
        <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
        <img src="https://randomuser.me/api/portraits/men/85.jpg" />
    </v-list-tile-avatar>
    <v-list-tile-content>
    <v-list-tile-title>John Leider</v-list-tile-title>
</v-list-tile-content>
<v-list-tile-action>
<v-btn icon @click.native.stop="mini = !mini">
<v-icon>chevron_left</v-icon>
</v-btn>
</v-list-tile-action>
</v-list-tile>
</v-list-item>
</v-list>
<v-list class="pt-0" dense>
<v-divider></v-divider>
<v-list-item v-for="item in items" :key="item">
<v-list-tile>
<v-list-tile-action>
<v-icon>{{ item.icon }}</v-icon>
</v-list-tile-action>
<v-list-tile-content>
<v-list-tile-title>{{ item.title }}</v-list-tile-title>
</v-list-tile-content>
</v-list-tile>
</v-list-item>
</v-list>
</v-navigation-drawer> -->
<v-toolbar fixed class="indigo darken-4" light>
    <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>Organiser</v-toolbar-title>
</v-toolbar>
<main>
    <v-container fluid>
        <v-layout style="" ref="sortable" row-sm column child-flex-sm >

            <v-card style=" margin:5px; padding:3px"  v-for="note in state" :key="note.key">
                <v-card-row class="blue darken-1" >
                    <v-card-title>
                        <span class="white--text">{{note.data.fileName}}</span>
                        <v-spacer></v-spacer>
                        <div>
                            <v-menu id="marriot" bottom left origin="top right">
                                <v-btn icon="icon" slot="activator" class="white--text">
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-item>
                                        <v-list-tile>
                                            <v-list-tile-title>Never show rewards</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-tile>
                                            <v-list-tile-title>Remove Card</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-tile>
                                            <v-list-tile-title>Send Feedback</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                    </v-card-title>
                </v-card-row>

                <v-card-row style="overflow:hidden; " class="white">

                    <v-subheader style="cursor:pointer; word-wrap:break-word; font-size:15px" v-on:click="openFile(note.data.filePath)" class="md-subhead">{{note.data.filePath}}</v-subheader>

                </v-card-row>

                <v-divider></v-divider>
                <div v-if="note.data.sections.length > 1" style="margin:5px; text-align:center!important">

                    <v-pagination  v-bind:length.number="note.data.sections.length" v-model="note.data.selectedSection"></v-pagination>
                </div>

                <v-card-row>
                    <v-card-text style=" ">


                        <div v-html="note.data.sections[note.data.selectedSection-1]" class="section"></div>
                    </v-card-text>


                </v-card-row>
                <!-- <v-divider></v-divider> -->



            </v-card>


        </v-layout>

        <!--v-router-->
    </v-container>
</main>
</v-app>
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
            state: applicationState,
            drawer: true,
            items: [
                { title: 'Home', icon: 'dashboard' },
                { title: 'About', icon: 'question_answer' }
            ],
            mini: false,
            right: null,
            pages:1
        }

    },
    computed: {
        filteredCards: function () {
            return this.numbers.filter(function (number) {
                return number % 2 === 0
            })
        }
    },
    mounted: function() {

        console.log(this.$refs.sortable);
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


            Sortable.create(that.$refs.sortable,{

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

/*<style src="highlight.js/styles/monokai.css">
</style>*/
<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

/*body.md-theme-default {

background: #4e4e4e;
}*/

pre {

    background: black;
    white-space: pre-wrap;
    padding:5px;
    border-radius:4px;
    font-weight: bolder;
    overflow: scroll;
}

code {

    background-color:rgba(0, 0, 0, 0);
    color:white;
    font-weight: bold;

}

.section {

    width:100%;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
