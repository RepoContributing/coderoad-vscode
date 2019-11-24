import { JSDOM } from 'jsdom'
import * as vscode from 'vscode'
import * as path from 'path'

const getNonce = (): string => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function render(panel: vscode.WebviewPanel, rootPath: string) {
  // load copied index.html from web app build
  const dom = await JSDOM.fromFile(path.join(rootPath, 'index.html'))
  const { document } = dom.window

  // set base href
  const base: HTMLBaseElement = document.createElement('base')
  base.href = panel.webview.asWebviewUri(vscode.Uri.file(rootPath)).toString() + '/'

  document.head.appendChild(base)

  // used for CSP
  const nonces: string[] = []

  // generate vscode-resource build path uri
  const createUri = (filePath: string): any => {
    return panel.webview.asWebviewUri(vscode.Uri.file(filePath))
    // .toString()
    // .replace(/^\/+/g, '') // remove leading '/'
    // .replace('/vscode-resource%3A', rootPath) // replace mangled resource path with root
  }

  // fix paths for scripts
  const scripts: HTMLScriptElement[] = Array.from(document.getElementsByTagName('script'))
  for (const script of scripts) {
    if (script.src) {
      const nonce: string = getNonce()
      nonces.push(nonce)
      script.nonce = nonce
      script.src = createUri(script.src)
    }
  }

  // add run-time script from webpack
  const runTimeScript = document.createElement('script')
  runTimeScript.nonce = getNonce()
  nonces.push(runTimeScript.nonce)
  const manifest = await import(path.join(rootPath, 'asset-manifest.json'))
  runTimeScript.src = createUri(path.join(rootPath, manifest.files['runtime-main.js']))
  document.body.appendChild(runTimeScript)

  // fix paths for links
  const styles: HTMLLinkElement[] = Array.from(document.getElementsByTagName('link'))
  for (const style of styles) {
    if (style.href) {
      style.href = createUri(style.href)
    }
  }

  // set CSP (content security policy) to grant permission to local files
  const cspMeta: HTMLMetaElement = document.createElement('meta')
  cspMeta.httpEquiv = 'Content-Security-Policy'
  cspMeta.content = [
    'font-src vscode-resource://*;',
    'img-src vscode-resource: https:;',
    `script-src ${nonces.map(nonce => `'nonce-${nonce}'`).join(' ')};`,
    `style-src vscode-resource: http: https: data:;`,
  ].join(' ')
  document.head.appendChild(cspMeta)

  // stringify dom
  const html = dom.serialize()

  console.log(html)

  // set view
  panel.webview.html = html
}

export default render
