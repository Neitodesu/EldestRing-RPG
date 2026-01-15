export class Enemy {
  constructor(type, health, damage) {
    this.type = type;
    this.health = health;
    this.damage = damage;
  }

  attack(player) {
    if (this.isDead()) {
      return;
    }
    player.takeDamage(this.damage);
    return this.damage;
  }

  takeDamage(amount) {
    this.health -= amount;
  }

  isDead() {
    return this.health <= 0;
  }
}
