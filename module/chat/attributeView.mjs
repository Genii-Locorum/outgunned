export class AttViewDialog extends Dialog {
    activateListeners (html) {
      super.activateListeners(html)
  
      html.find('.clicked').dblclick(async event => this._onSelectArrowClicked(event))
    }
  
    async _onSelectArrowClicked (event) {
      const chosen = event.currentTarget.closest('.large-icon')
      let choice = chosen.dataset.property
      let score = Number(chosen.dataset.score)
      let current = this.data.data[choice]
      if (current===score) {
        score = 0
      }
      this.data.data[choice] = score  
      

      //Update the new values on the form
      const form = event.currentTarget.closest('.item-skill-grid')
      let attVal = form.querySelector('.'+choice)
      if(['role','trope'].includes(choice)) {
        if(score===0) {
            attVal.innerHTML ="<i class='fa-regular fa-diamond'></i>"
        } else {
            attVal.innerHTML ="<i class='fa-solid fa-diamond'></i>"            
        }
      } else if (choice==="value") {
        if(score===0) {
            attVal = form.querySelector('.value1')
            attVal.innerHTML ="<i class='fa-regular fa-diamond'></i>"
            attVal = form.querySelector('.value2')
            attVal.innerHTML ="<i class='fa-regular fa-diamond'></i>"  
        } else if(score===1){
            attVal = form.querySelector('.value1')
            attVal.innerHTML ="<i class='fa-solid fa-diamond'></i>"
            attVal = form.querySelector('.value2')
            attVal.innerHTML ="<i class='fa-regular fa-diamond'></i>"              
        } else if(score===2){
            attVal = form.querySelector('.value1')
            attVal.innerHTML ="<i class='fa-solid fa-diamond'></i>"
            attVal = form.querySelector('.value2')
            attVal.innerHTML ="<i class='fa-solid fa-diamond'></i>"              
        }
      }  
    }

    static async create (attName,value,role,trope) {
      let destination = 'systems/outgunned/templates/actor/parts/attribute.html';
      let freeform = game.settings.get('outgunned', 'freeform')
      if (!game.user.isGM) {freeform=false}  
      let data = {
        attName,
        value,
        role,
        trope,
        freeform
      }
      const html = await renderTemplate(destination,data);
      
      return new Promise(resolve => {
        const dlg = new AttViewDialog(
          {
            title: attName,
            content: html,
            data,
            buttons: {},
            close: () => {
                const selected = data
                return resolve(data)
            }
          },
          { classes: ['outgunned'] }
        )
        dlg.render(true)
      })

    }
  }