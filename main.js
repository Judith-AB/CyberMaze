import Scene1_Opening from './scenes/Scene1_opening.js';
import Scene2_Avatar  from './scenes/Scene2_Avatar.js';
import Scene3_Maze    from './scenes/Scene3_Maze.js';
import Scene4_Exit    from './scenes/Scene4_Exit.js';

const config = {
  type: Phaser.AUTO,
  width: 960,          // wider so maze fits nicely
  height: 576,
  backgroundColor: '#07070a',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [ Scene1_Opening, Scene2_Avatar, Scene3_Maze, Scene4_Exit ]
};

new Phaser.Game(config);
