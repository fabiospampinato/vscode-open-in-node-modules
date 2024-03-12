
/* IMPORT */

import findeUp from 'find-up-path';
import {moduleResolve} from 'import-meta-resolve';
import path from 'node:path';
import url from 'node:url';
import {alert, getActiveFilePath, getProjectRootPath, openInEditor, openInWindow} from 'vscode-extras';
import {castArray, getPackagesFromEditor, getPackagesFromPrompt} from './utils';

/* MAIN */

const open = async ( names?: string | string[] ): Promise<void> => {

  const filePath = getActiveFilePath ();
  const rootPath = getProjectRootPath ();
  const rootFilePath = rootPath && path.join ( rootPath, 'index.js' );
  const fromPath = filePath || rootFilePath;

  if ( !fromPath ) return alert.error ( 'You need to have at least a file open' );

  names ||= getPackagesFromEditor () || await getPackagesFromPrompt ();

  if ( !names?.length ) return;

  const fromURL = url.pathToFileURL ( fromPath );

  for ( const name of castArray ( names ) ) {

    try {

      const moduleUrl = moduleResolve ( name, fromURL );
      const modulePath = url.fileURLToPath ( moduleUrl );
      const packagePath = findeUp ( 'package.json', path.dirname ( modulePath ) );

      if ( packagePath ) {

        openInWindow ( path.dirname ( packagePath ), true );

      } else {

        openInEditor ( modulePath );

      }

    } catch {

      alert.error ( `Module "${name}" not found in node_modules` );

    }

  }

};

/* EXPORT */

export {open};
