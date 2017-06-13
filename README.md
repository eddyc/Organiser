
![alt text](./app/icons/Logo.png "Logo Title Text 1")

# organiser

> Easily capture and view notes from text files written using markdown

This program allows you to quickly view notes written in any text file on your computer.
Notes must be written in markdown and be delimited with a line above and below containing four equals signs.
For example:

```
Some text in my file that won't be parsed.

====

# Check this out
The text in here will be parsed as markdown

====

```

Files are added to the database using the key command: control+command+n
Files are removed from the database using the key command: control+command+m

Although this is an electron project, due to some technical hurdles involving getting the file name from arbitrary focused programs it runs only in macOS for the moment.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
