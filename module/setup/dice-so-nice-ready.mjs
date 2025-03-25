export function listen () {
    Hooks.once('diceSoNiceReady', dice3d => {
      dice3d.addSystem({ id: 'outgunned', name: 'Outgunned' }, 'preferred');
      dice3d.addDicePreset({
        type: 'da',
         labels: ["1","2","3","4","5","6"],
         font:"OG-dice",
         fontScale: 1.4,        
         system: 'outgunned'
      });
    })
  }