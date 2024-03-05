
/* IMPORT */

import vscode from 'vscode';

/* MAIN */

const castArray = <T> ( value: T | T[] ): T[] => {

  return Array.isArray ( value ) ? value : [value];

};

const getPackagesFromEditor = (): string[] | undefined => {

  const {activeTextEditor} = vscode.window;

  if ( !activeTextEditor ) return;

  const {document, selections} = activeTextEditor;
  const texts = selections.map ( selection => document.getText ( selection ) ).filter ( Boolean );

  if ( !texts.length ) return;

  return texts;

};

const getPackagesFromPrompt = async ( value?: string ): Promise<string | undefined> => {

  return await vscode.window.showInputBox ({
    placeHolder: 'NPM package name...',
    value
  });

};

/* EXPORT */

export {castArray, getPackagesFromEditor, getPackagesFromPrompt};
