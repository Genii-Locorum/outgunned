export class OutgunnedDiceRolls {

  static async calcResult(dices = [], keepPairs = []) {
    const values = [...keepPairs, ...dices];  
    
    const equals = countEquals(values);
    const successes = countSuccess(values);
  
    const restDice = [];
    const newKeepPairs = [];
    values.forEach((dice) => {
      if (equals[dice] >= 2) {
        newKeepPairs.push(dice);
      } else {
        restDice.push(dice);
      }
    });
    newKeepPairs.sort();
    restDice.sort();
    dices.sort();

    return {
      roll: dices,
      pairsDice: newKeepPairs,
      restDice: restDice,
      successes,
      equals,
    };

    function countEquals(_values) {
      const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      _values.forEach((i) => (count[i] = (count[i] || 0) + 1));
      return count;
    }

    function countSuccess(_values) {
      const result = { basic: 0, critical: 0, extreme: 0, impossible: 0, jackpot: 0, total: 0 };
      const _equals = countEquals(_values);
  
      for (const [, value] of Object.entries(_equals)) {
        if (value === 2) {
          result.basic++;
          result.total++;
        } else if (value === 3) {
          result.critical++;
          result.total = result.total + 3;
        } else if (value === 4) {
          result.extreme++;
          result.total = result.total + 9;
        } else if (value === 5) {
          result.impossible++;
          result.total = result.total + 27;
        }  else if (value >= 6) {
          result.impossible++;
          result.total = result.total + 81;
        }
      }
      return result;
    }
  }

  static async reduceSuccess (rollResult) {
    const successes = { ...rollResult.successes };
    let targetSuccess = 0;
    let targetDice = 7
    const values = [...rollResult.pairsDice, ...rollResult.restDice];

    if (successes.basic > 0) {
      successes.basic--;
      successes.total = successes.total-1;
      targetSuccess = 2;
    } else if (successes.critical > 0) {
      successes.critical--;
      successes.total = successes.total-3;
      targetSuccess = 3;
    } else if (successes.extreme > 0) {
      successes.extreme--;
      successes.total = successes.total-9;
      targetSuccess = 4;
    } else if (successes.impossible > 0) {
      successes.impossible--;
      successes.total = successes.total-27;
      targetSuccess = 5;
    } else if (successes.jackpot > 0) {
      successes.jackpot--;
      successes.total = successes.total-81;
      targetSuccess = 6;
    }

    //Go through each dice value successes and work out dice number with lowest value where targetSuccess matches
    for (const [key, value] of Object.entries(rollResult.equals)) {
      if (value === targetSuccess) {
        targetDice = key
        break
      }  
    }  
   
    const newPairsDice = [];
    const newRestDice = [];
    values.forEach((dice) => {
      if (rollResult.equals[dice] >= 2 && dice != targetDice)  {
        newPairsDice.push(dice);
      } else {
        newRestDice.push(dice);
      }
    });
    newPairsDice.sort();
    newRestDice.sort();
    rollResult.pairsDice = newPairsDice;
    rollResult.restDice = newRestDice;
    rollResult.successes = successes;

    return (rollResult)
  }

 

}