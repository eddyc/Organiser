"use strict"


export default function getActiveWindow(callback) {

    const spawn = require('child_process').spawn;

    const ls = spawn('/bin/sh', [ '-c',  `
    cmd='global frontApp, frontAppName, windowTitle
    set windowTitle to ""
    tell application "System Events"
    set frontApp to first application process whose frontmost is true
    set frontAppName to name of frontApp
    tell process frontAppName
    tell (1st window whose value of attribute "AXMain" is true)
    set windowTitle to value of attribute "AXTitle"
    end tell
    end tell
    end tell

    set thePath to ""
    try
    tell application (path to frontmost application as text)
    set thePath to (path of document 1) as text
    end tell
    on error
    try
    tell application "System Events" to tell (process 1 where frontmost is true)
    set thePath to value of attribute "AXDocument" of window 1
    end tell
    end try
    end try


    return {frontAppName,thePath}
    '
    osascript -e "$cmd"
    ` ]);

    ls.stdout.setEncoding('utf8');

    //Obtain successful response from script
    ls.stdout.on('data', function(stdout){
        callback(reponseTreatment(stdout.toString()));
    });

    //Obtain error response from script
    ls.stderr.on("data",function(stderr){

        console.log(stderr.toString());
        // throw stderr.toString();
    });

    ls.stdin.end();

};

function reponseTreatment(response){
    let window = {};
    response = response.split(",");
    window.app = response[0];
    window.title = response[1].replace(/\n$/, "").replace(/^\s/, "");
    return window;
}
