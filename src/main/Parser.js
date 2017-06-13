/*

====
[ ] Stuff


More stuff

====
*/

/*

====
black

thing
====

*/

"use strict"


export default class Parser {

    constructor(blockDelimiter) {

        this.blockDelimiter = blockDelimiter;
        this.fs = require("fs");
    }

    parseFile(path) {

        let file = this.fs.readFileSync(path, "utf8");
        let marked = require("marked");
        let lines = file.split("\n");
        let fileName = path.replace(/^.*(\\|\/|\:)/, '');
        let sections = [];
        let insideBlock = false;
        let blockLines = "";
        for (let i = 0; i < lines.length; ++i) {

            if (lines[i].includes(this.blockDelimiter) === true) {

                if (insideBlock === false) {

                    insideBlock = true;
                    continue;
                }
                else if (insideBlock === true) {

                    sections.push(marked(blockLines));
                    blockLines = "";
                    insideBlock = false;
                    continue;
                }
            }
            else if (insideBlock === true) {

                blockLines += lines[i] + "\n";
            }
        }

        let data = {
            sections:sections,
            filePath:path,
            fileName:fileName
        };
        return data;
    }
}