/* global Dialog, renderTemplate */
export class ItemSelectDialog extends Dialog {
    activateListeners (html) {
      super.activateListeners(html)
  
      html
        .find('.select-newItem')
        .click(async event => this._onSelectItemClicked(event))
    }
  
    async _onSelectItemClicked (event) {
      const li = event.currentTarget.closest('.item')
      this.data.data.newList[Number(li.dataset.index)].selected = true
      event.currentTarget.style.display = 'none'
      if (!this.data.data.added) this.data.data.added = 0
      this.data.data.added++
      const form = event.currentTarget.closest('.newItem-selector')
      const divCount = form.querySelector('.count')
      divCount.innerText = this.data.data.added
      if (this.data.data.added >= this.data.data.optionsCount) {
        this.close()
      }
    }
  
    static async create (data) {
      const html = await foundry.applications.handlebars.renderTemplate(
        'systems/outgunned/templates/dialog/newItemSelect.html',
        data
      ) 
      return new Promise(resolve => {
        const dlg = new ItemSelectDialog(
          {
            title: data.title,
            content: html,
            data,
            buttons: {},
            close: () => {
              if (!data.added >= data.optionsCount) return resolve(false)
              const selected = data.newList.filter(newList => newList.selected)
              return resolve(selected)
            }
          },
          { classes: ['outgunned', 'dialog', 'newItem-select'] }
        )
        dlg.render(true)
      })
    }
  }