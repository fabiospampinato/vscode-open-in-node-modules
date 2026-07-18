
/* IMPORT */

import findeUp from 'find-up-path';
import {createRequire} from 'node:module';
import path from 'node:path';
import {alert, getActiveFilePath, getProjectRootPath, openInEditor, openInWindow} from 'vscode-extras';
import {castArraySplitted, getPackagesFromEditor, getPackagesFromPrompt} from './utils';

/* MAIN */

const open = async ( names?: string | string[] ): Promise<void> => {

  const filePath = getActiveFilePath ();
  const rootPath = getProjectRootPath ();
  const rootFilePath = rootPath && path.join ( rootPath, 'index.js' );
  const fromPath = filePath || rootFilePath;

  if ( !fromPath ) return alert.error ( 'You need to have at least a file open' );

  names ||= getPackagesFromEditor () || await getPackagesFromPrompt ();

  if ( !names?.length ) return;

  for ( const name of castArraySplitted ( names ) ) {

    try {

      const require = createRequire ( fromPath );
      const modulePath = require.resolve ( name );
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
