import { weapons } from '../js/data.js';

export class Player {
  constructor(name) {
    this.name = name;
    this.health = 1;
    this.weapon = 'Axe';
    this.potions = 2;
  }

  attack(enemy) {
    if (enemy.isDead()) {
      return;
    }
    const damage = weapons[this.weapon];
    enemy.takeDamage(damage);
    return damage;
  }

  heal() {
    if (this.potions <= 0) {
      return;
    }

    const healAmount = 35;

    this.health += healAmount;
    this.potions--;

    return healAmount;
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  isDead() {
    return this.health <= 0;
  }
}
