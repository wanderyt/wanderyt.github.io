title: Configure vscode with file.exclude
date: 2019-01-21 13:53:49
categories:
- UI Development
tags:
- IDE
---

Reference resource: [How to do negative pattern for VS Code files exclude](https://maxisam.github.io/2016/12/09/how-to-do-negative-pattern-for-VS-code-files-exclude/)

VSCode does not supprt negative regular expression ('!') on user settings `files.exclude`.

But we could have work around to set file exclusion rule in file explorer.

For example, if we only want to display `node_modules/@project` folder and hide all other folders, the setting could be like this:

```json
// File explorer
"files.exclude": {
  // Not hide node modules
  "**/node_modules/": false,
  // Hide node modules started with .
  "**/node_modules/.*": true,
  // Hide node modules started with any letter except @
  "**/node_modules/[abcdefghijklmnopqrstuvwxyz]*": true,
  // Hide node modules started with @ and any letter except p
  "**/node_modules/@[abcdefghijklmnoqrstuvwxyz]*": true,
  // Hide node modules started with @ and any letter except pr
  "**/node_modules/@p[abcdefghijklmnopqstuvwxyz]*": true,
  // Hide node modules started with @ and any letter except pro
  "**/node_modules/@pr[abcdefghijklmnpqrstvwxyz]*": true,
},
```

This could work perfectly. Yep.