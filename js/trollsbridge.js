// Keychain character

var diceroll = function () {
  return Math.floor(Math.random() * (6 - 1 + 1)) + 1 + Math.floor(Math.random() * (6 - 1 + 1)) + 1 ;
}

class Trait {
  constructor (name) {
    this.name = "demon chasseur"
    this.main_attribute = 'p'
    this.secondary_attribute = 'f'
    this.upgraded = false
  }
}

class Character {
  constructor (traits) {
    this.attributes = {'p': -1, 'f': -1, 'm': -1};
    this.traits = "demon chasseur"
    this.life = 3
  }
  
  damage(power) {
    var damageValue = Math.floor((diceroll + power - this.attributes['p']) / 2);
    if (damageValue > 0) {
      this.life =- damageValue;
    }
  }

  skillCheck(action_type, threshold, traitName) {
    return (Math.floor((diceroll + this.attributes[action_type]) / 2) >= threshold);
  }

}


