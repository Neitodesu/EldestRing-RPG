import { Player } from '../js/player.js';
import { Enemy } from '../js/enemy.js';
import { enemyData } from './data.js';
import {
  attackButton,
  healButton,
  quitButton,
  muteButton,
  startButton,
  audioPlayer,
  updateBattleText,
  updateBattleInfo,
  menuScreen,
  gameScreen,
} from './ui.js';

const hero = new Player('Caeser');

let enemyIndex = 0;
let currentEnemy = new Enemy(
  enemyData[enemyIndex].type,
  enemyData[enemyIndex].health,
  enemyData[enemyIndex].damage,
);

let battleActive = true;

updateBattleText(`A wild ${currentEnemy.type} appears!`);
updateBattleInfo(
  `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
);

const resetGame = () => {
  hero.health = 100;
  hero.weapon = 'Axe';
  hero.potions = 2;
  enemyIndex = 0;
  currentEnemy = new Enemy(
    enemyData[enemyIndex].type,
    enemyData[enemyIndex].health,
    enemyData[enemyIndex].damage,
  );
  battleActive = true;

  updateBattleText(`A wild ${currentEnemy.type} appears!`);
  updateBattleInfo(
    `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
  );

  enableButtons();
};

const disableButtons = () => {
  attackButton.disabled = true;
  healButton.disabled = true;
  quitButton.disabled = true;
};

const enableButtons = () => {
  attackButton.disabled = false;
  healButton.disabled = false;
  quitButton.disabled = false;
};

const rewardWeapon = (player, weaponName) => {
  player.weapon = weaponName;
  updateBattleText(`You obtained the ${weaponName}`);
  updateBattleInfo(
    `Weapon: ${player.weapon} | Health: ${player.health} | Potions: ${player.potions}`,
  );
};

const muteAudio = () => {
  audioPlayer.volume = 0;
};

const setMusic = (path) => {
  audioPlayer.pause();
  audioPlayer.src = path;
  audioPlayer.load();
  audioPlayer.volume = 0.1;
  audioPlayer.currentTime = 0;
  audioPlayer.play();
};

muteButton.addEventListener('click', () => {
  if (audioPlayer.volume == 0) {
    audioPlayer.volume = 0.1;
    muteButton.textContent = `MUTE`;
    return;
  }
  muteAudio();
  muteButton.textContent = 'UNMUTE';
});

attackButton.addEventListener('click', () => {
  if (!battleActive) {
    return;
  }

  disableButtons();

  // Attack!
  const damage = hero.attack(currentEnemy);
  updateBattleText(`You attack the ${currentEnemy.type} for ${damage} damage`);

  // Check for enemy death

  if (currentEnemy.isDead()) {
    updateBattleText(`${currentEnemy.type} has been defeated!`);

    if (enemyIndex == 1) {
      setTimeout(() => {
        rewardWeapon(hero, 'Sword');
      }, 800);
    }

    if (enemyIndex == 3) {
      setTimeout(() => {
        rewardWeapon(hero, 'Lightning Staff');
      }, 800);
    }

    enemyIndex++;
    //NOTE: Cycles next enemy
    if (enemyIndex < enemyData.length) {
      setTimeout(() => {
        currentEnemy = new Enemy(
          enemyData[enemyIndex].type,
          enemyData[enemyIndex].health,
          enemyData[enemyIndex].damage,
        );
        updateBattleText(`A wild ${currentEnemy.type} appears!`);
        enableButtons();
      }, 2500);
    } else {
      updateBattleText('🏆 You defeated all the enemies! Victory!');
      battleActive = false;

      setTimeout(() => {
        gameScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
        resetGame();

        setMusic('assets/audio/mainmenu.mp3');
      }, 3000);
    }
    return;
  }

  // Enemy attacks if not dead
  setTimeout(() => {
    const enemyDamage = currentEnemy.attack(hero);
    updateBattleText(`${currentEnemy.type} attacks for ${enemyDamage} damage!`);

    updateBattleInfo(
      `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
    );

    // If you ded
    if (hero.isDead()) {
      hero.health = 0;
      updateBattleInfo(
        `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
      );
      setTimeout(() => {
        updateBattleText('You Ded...Game Over...');
        battleActive = false;
        setTimeout(() => {
          gameScreen.classList.add('hidden');
          menuScreen.classList.remove('hidden');
          resetGame();

          setMusic('assets/audio/mainmenu.mp3');
        }, 3000);
      }, 1000);
    } else {
      enableButtons();
    }
  }, 1000);
});

healButton.addEventListener('click', () => {
  if (!battleActive) {
    return;
  }

  if (hero.potions <= 0) {
    updateBattleText('You have no potions left!');
    return;
  }

  disableButtons();

  // Player heals
  const healAmount = hero.heal();
  updateBattleText(`You used a potion and healed ${healAmount} HP!`);
  updateBattleInfo(
    `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
  );

  // Enemy attacks
  setTimeout(() => {
    const enemyDamage = currentEnemy.attack(hero);
    updateBattleText(
      `${currentEnemy.type} attacks you for ${enemyDamage} damage!`,
    );
    updateBattleInfo(
      `Weapon: ${hero.weapon} | Health: ${hero.health} | Potions: ${hero.potions}`,
    );

    // If you ded
    if (hero.isDead()) {
      setTimeout(() => {
        updateBattleText('You Ded...Game Over...');
        battleActive = false;

        setTimeout(() => {
          gameScreen.classList.add('hidden');
          menuScreen.classList.remove('hidden');
          resetGame();

          setMusic('assets/audio/mainmenu.mp3');
        }, 3000);
      }, 1000);
    } else {
      enableButtons();
    }
  }, 800);
});

quitButton.addEventListener('click', () => {
  updateBattleText('You quit the battle... Game Over.');
  disableButtons();
  battleActive = false;

  setTimeout(() => {
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');

    setMusic('assets/audio/mainmenu.mp3');
    resetGame();
  }, 2000);
});

startButton.addEventListener('click', () => {
  setTimeout(() => {
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    setMusic('assets/audio/Epic.mp3');
  }, 2000);
});

setMusic('assets/audio/mainmenu.mp3');
