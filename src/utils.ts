
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';
import * as Commands from './commands';

/* UTILS */

const Utils = {

  initCommands ( context: vscode.ExtensionContext ) {

    const {commands} = vscode.extensions.getExtension ( 'fabiospampinato.vscode-open-in-node-modules' ).packageJSON.contributes;

    commands.forEach ( ({ command, title }) => {

      const commandName = _.last ( command.split ( '.' ) ) as string,
            handler = Commands[commandName],
            disposable = vscode.commands.registerCommand ( command, () => handler () );

      context.subscriptions.push ( disposable );

    });

    return Commands;

  },

  folder: {

    open ( folderPath, inNewWindow? ) {

      folderPath = path.normalize ( folderPath );

      const folderuri = vscode.Uri.file ( folderPath );

      vscode.commands.executeCommand ( 'vscode.openFolder', folderuri, inNewWindow );

    }

  }

};

/* EXPORT */

export default Utils;
