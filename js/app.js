import { Player } from '../js/player.js';
import { Enemy } from '../js/enemy.js';
import { enemyData } from './data.js';
import {
  attackButton,
  healButton,
  quitButton,
  muteButton,
  fadeOverlay,
  startButton,
  audioPlayer,
  updateBattleText,
  updateBattleInfo,
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
  audioPlayer.currentTime = 0;
  audioPlayer.src = '../assets/audio/mainmenu.mp3';
  audioPlayer.play();

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
  // If dead, load next enemy
  // If all dead, win!

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
    if (enemyIndex < enemyData.length) {
      setTimeout(() => {
        currentEnemy = new Enemy(
          enemyData[enemyIndex].type,
          enemyData[enemyIndex].health,
          enemyData[enemyIndex].damage,
        );
        updateBattleText(`A wild ${currentEnemy.type} appears!`);
        enableButtons();
      }, 2000);
    } else {
      updateBattleText('🏆 You defeated all the enemies! Victory!');
      battleActive = false;

      // Step 1: Fade audio out smoothly
      const fadeOutInterval = setInterval(() => {
        if (audioPlayer.volume > 0.05) {
          audioPlayer.volume -= 0.05;
        } else {
          audioPlayer.volume = 0;
          clearInterval(fadeOutInterval);
        }
      }, 100);

      // Step 2: Fade screen to black
      setTimeout(() => {
        fadeOverlay.classList.add('fade-to-black');
      }, 1200);

      setTimeout(() => {
        gameScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');
        resetGame();

        fadeOverlay.classList.remove('fade-to-black');
        fadeOverlay.classList.add('fade-out-overlay');

        // Reset and replay music
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        audioPlayer.volume = 0.1;
        muteButton.textContent = 'MUTE';

        // Clean up overlay class
        setTimeout(() => {
          fadeOverlay.classList.remove('fade-out-overlay');
        }, 1000);
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
      }, 1000);
    } else {
      enableButtons();
    }
  }, 800);
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
      }, 1000);
    } else {
      enableButtons();
    }
  }, 800);
});

quitButton.addEventListener('click', () => {
  // Show quit message and stop inputs
  updateBattleText('You quit the battle... Game Over.');
  disableButtons();
  battleActive = false;

  // Step 1: Fade audio out smoothly
  const fadeOutInterval = setInterval(() => {
    if (audioPlayer.volume > 0.05) {
      audioPlayer.volume -= 0.05;
    } else {
      audioPlayer.volume = 0;
      clearInterval(fadeOutInterval);
    }
  }, 100);

  // Step 2: Fade screen to black
  setTimeout(() => {
    fadeOverlay.classList.add('fade-to-black');
  }, 1200);

  setTimeout(() => {
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    resetGame();

    fadeOverlay.classList.remove('fade-to-black');
    fadeOverlay.classList.add('fade-out-overlay');

    // Reset and replay music
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    audioPlayer.volume = 0.1;
    muteButton.textContent = 'MUTE';

    // Clean up overlay class
    setTimeout(() => {
      fadeOverlay.classList.remove('fade-out-overlay');
    }, 1000);
  }, 3000);
});

const menuScreen = document.querySelector('#menuScreen');
const gameScreen = document.querySelector('#gameScreen');

startButton.addEventListener('click', () => {
  // Step 1: Fade to black
  fadeOverlay.classList.remove('fade-out-overlay');
  fadeOverlay.classList.add('fade-to-black');

  // Step 2: Wait for fade to black to finish
  setTimeout(() => {
    // Step 3: Switch to game screen
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // Step 4: Fade back in and enable interaction
    fadeOverlay.classList.remove('fade-to-black');
    fadeOverlay.classList.add('fade-out-overlay');
    audioPlayer.src = '../assets/audio/Epic.mp3';
    audioPlayer.currentTime = 0;
    audioPlayer.play();

    // Clean up fade-out after it's done
    setTimeout(() => {
      fadeOverlay.classList.remove('fade-out-overlay');
    }, 1000);
  }, 2000);
});

audioPlayer.volume = 0.1;
