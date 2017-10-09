"use strict"


export default class Parser {

    constructor(blockDelimiter) {

        this.blockDelimiter = blockDelimiter;
        this.fs = require("fs");
        this.marked = require("marked");

        this.marked.setOptions({
            highlight: function (code) {
                return require('highlight.js').highlightAuto(code).value;
            },
            sanitize:true,
            pedantic:true
        });

        // this.renderer = new this.marked.Renderer();
        //
        // this.renderer.code = function (text, level) {
        //
        //     console.log(text);
        //     var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        //
        //     return text + level;
        // }


    }

    parseFile(path) {

        let extension = path.split('.').pop();
        let file = this.fs.readFileSync(path, "utf8");
        let lines = file.split("\n");
        let fileName = path.replace(/^.*(\\|\/|\:)/, '');


        let tags = [];
        let newLines = []
        let parseSections = false;

        for (let i = 0; i < lines.length; ++i) {

            if (lines[i].includes("tags:") === true) {

                tags = tags.concat(lines[i].split("tags:")[1].split(",").map(x => {return x.trim()}));
            }
            else {

                newLines.push(lines[i]);
            }

            if (lines[i].includes(this.blockDelimiter) === true) {

                parseSections = true;
            }
        }

        tags = Array.from(new Set(tags));

        lines = newLines;

        if (parseSections === false && (extension === "md" || extension === "markdown" || extension === "todo")) {

            file = lines.join("\n");
            let rendered = this.marked(file, {renderer: this.renderer});

            let data = {
                tags:tags,
                sections:[rendered],
                selectedSection:1,
                filePath:path,
                fileName:fileName
            };
            return data;
        }


        let sections = [];
        let insideBlock = false;
        let blockLines = "";
        let blockIndent = 0;

        for (let i = 0; i < lines.length; ++i) {

            if (lines[i].includes(this.blockDelimiter) === true) {

                if (insideBlock === false) {

                    blockIndent = lines[i].indexOf(this.blockDelimiter);
                    insideBlock = true;
                    continue;
                }
                else if (insideBlock === true) {

                    let rendered = this.marked(blockLines);
                    sections.push(rendered);
                    blockLines = "";
                    insideBlock = false;
                    continue;
                }
            }
            else if (insideBlock === true) {

                let whiteSpaceLength = lines[i].search(/\S|$/);

                if (whiteSpaceLength < blockIndent) {

                    lines[i] = lines[i].substring(whiteSpaceLength);
                }
                else {

                    lines[i] = lines[i].substring(blockIndent);
                }
                blockLines += lines[i] + "\n";
            }
        }


        let data = {
            tags:tags,
            sections:sections,
            selectedSection:1,
            filePath:path,
            fileName:fileName
        };
        return data;
    }
}
