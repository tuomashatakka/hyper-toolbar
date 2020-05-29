# hyper-toolbar

Toolbar for https://hyper.is terminal.

![screenshot of a hyper with a toolbar][screenshot]

Configure any number of clickable buttons to the bottom of the terminal application's footer.

## Config example

Add toolbar section to your ~/.hyper.js configuration file:

```js
module.exports = {
  config: {
    toolbar: {
      itemTextColor: '#77718c',
      itemBackgroundColor: colors.black,
      itemTextColorHover: colors.lightWhite,
      itemBackgroundColorHover: colors.lightBlack,
      height: 60,
      items: [
        {
          text:   'npm install',
          icon:   'add',
          action: 'npm i',
        },

        {
          text:   'npm start',
          icon:   'settings',
          action: 'npm run start',
        },

        {
          text:   'VSCode',
          icon:   'keyboard',
          action: 'code-insiders .',
        },
      ]
    }
  }
}
```


[screenshot]: https://raw.githubusercontent.com/tuomashatakka/hyper-toolbar/master/screenshot.png
