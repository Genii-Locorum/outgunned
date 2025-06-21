import { OutgunnedMenu } from './layers.mjs'

export default function (app, html, data) {
  if (typeof html.querySelector === 'function') {
    html.querySelector('button[data-tool="ogdummy"]')?.closest('li').remove()
  }
  OutgunnedMenu.renderControls(app, html, data)
}