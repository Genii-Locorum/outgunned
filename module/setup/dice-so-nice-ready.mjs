export function listen () {
    Hooks.once('diceSoNiceReady', dice3d => {
      dice3d.addSystem({ id: 'outgunned', name: 'Outgunned' }, 'preferred');
      dice3d.addDicePreset({
        type: 'da',
        /*labels: ['systems/outgunned/assets/dice1.png',
                 'systems/outgunned/assets/dice2.png',
                 'systems/outgunned/assets/dice3.png',
                 'systems/outgunned/assets/dice4.png',
                 'systems/outgunned/assets/dice5.png',
                 'systems/outgunned/assets/dice6.png'],*/
         labels: ["1","2","3","4","5","6"],
         font:"OG-dice",
         fontScale: 2.2,        
         system: 'outgunned'
      });
    })
  }