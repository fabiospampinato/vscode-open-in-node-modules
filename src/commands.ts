
/* IMPORT */

import findeUp from 'find-up-path';
import {moduleResolve} from 'import-meta-resolve';
import path from 'node:path';
import url from 'node:url';
import vscode from 'vscode';
import {getProjectRootPath} from 'vscode-extras';
import {castArray, getPackagesFromEditor, getPackagesFromPrompt} from './utils';

/* MAIN */

const open = async ( names?: string | string[] ): Promise<void> => {

  const fromPath = vscode.window.activeTextEditor?.document.uri.fsPath || getProjectRootPath ();

  if ( !fromPath ) return void vscode.window.showErrorMessage ( 'You need to have at least a file open' );

  names ||= getPackagesFromEditor () || await getPackagesFromPrompt ();

  if ( !names?.length ) return;

  const fromURL = url.pathToFileURL ( fromPath );

  for ( const name of castArray ( names ) ) {

    try {

      const moduleUrl = moduleResolve ( name, fromURL );
      const modulePath = url.fileURLToPath ( moduleUrl );
      const packagePath = findeUp ( 'package.json', path.dirname ( modulePath ) );

      if ( packagePath ) {

        const packageURI = vscode.Uri.file ( path.dirname ( packagePath ) );

        vscode.commands.executeCommand ( 'vscode.openFolder', packageURI, true );

      } else {

        const moduleURI = vscode.Uri.file ( modulePath );

        vscode.commands.executeCommand ( 'vscode.open', moduleURI );

      }

    } catch {

      vscode.window.showErrorMessage ( `Module "${name}" not found in node_modules` );

    }

  }

};

/* EXPORT */

export {open};
