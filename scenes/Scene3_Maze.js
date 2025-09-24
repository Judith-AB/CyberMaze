import { tasksData } from '../data/tasksData.js';

export default class Scene3_Maze extends Phaser.Scene {
    constructor() { super({ key: 'Scene3_Maze' }); }

    preload() {
        this.load.image('guyhead', 'assets/guyhead.png');
        this.load.image('girlhead', 'assets/girlhead.png');

        this.load.audio('correct', 'assets/audio/correct.wav');
        this.load.audio('wrong', 'assets/audio/wrong.wav');
    }

    create() {
        this.cellSize = 48; // Made cellSize a scene property
        this.taskActive = false;
        this.tasksCompleted = new Set();
        // This automatically counts all tasks in your data file
        this.totalTasks = Object.keys(tasksData).length;

        // ===== 1. REVISED MAZE WITH ALL 9 OBSTACLES =====
        // Added the missing 'I' obstacle (formerly 'W')
        this.maze = [
            "WWWWWWWWWWWWWWWWWWWW",
            "W..........W...H...W",
            "W.WWWWWWWWWW.W.WWWWW",
            "W.S.....P....W...B.W",
            "W.WWWWW.WWWWWWWW.W.W",
            "W.T.....F....C...W.W",
            "W.WWWWW.WWWWWWWW.W.W",
            "W.D.......W...I..W.W", // <- Missing obstacle added here
            "W.WWWWWWWWWWWWWW.W.W",
            "W................E.W",
            "WWWWWWWWWWWWWWWWWWWW"
        ];

        this.walls = this.add.group();
        this.obstacles = this.add.group();
        this.exit = null;

        const wallFill = 0x081017;
        const wallStroke = 0x00d9ff;

        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[row].length; col++) {
                // Adjusted x/y to center the larger maze
                const x = col * this.cellSize + this.cellSize / 2;
                const y = row * this.cellSize + this.cellSize / 2;
                const cell = this.maze[row][col];

                if (cell === 'W') {
                    const wall = this.add.rectangle(x, y, this.cellSize, this.cellSize, wallFill).setStrokeStyle(2, wallStroke, 1);
                    this.physics.add.existing(wall, true);
                    this.walls.add(wall);
                // ===== 2. UPDATED TO RECOGNIZE ALL TASK TYPES (I instead of W) =====
                } else if ("PSFDCBHTI".includes(cell)) {
                    const obs = this.add.rectangle(x, y, this.cellSize - 4, this.cellSize - 4, 0xdfb07b).setStrokeStyle(2, 0xffffff, 0.5);
                    this.physics.add.existing(obs, true);
                    obs.taskType = cell;
                    this.obstacles.add(obs);
                } else if (cell === 'E') {
                    this.exit = this.add.rectangle(x, y, this.cellSize - 4, this.cellSize - 4, 0x00ff88).setStrokeStyle(2, 0xffffff, 0.8);
                    this.physics.add.existing(this.exit, true);
                }
            }
        }

        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1);
        g.fillCircle(2, 2, 2);
        g.generateTexture('spark', 4, 4);
        g.destroy();

        const chosenAvatar = this.registry.get('avatar');
        const playerImageKey = (chosenAvatar === 'girl') ? 'girlhead' : 'guyhead';
        // Player starts at (1,1) which is now an empty space '.'
        this.player = this.add.image(this.cellSize * 1.5, this.cellSize * 1.5, playerImageKey);
        this.player.setDisplaySize(32, 32);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.walls);

        this.obstacles.getChildren().forEach(obs => {
            this.physics.add.overlap(this.player, obs, () => this.handleTask(obs), null, this);
        });

        if (this.exit) {
            this.physics.add.overlap(this.player, this.exit, () => {
                if (this.tasksCompleted.size === this.totalTasks) {
                    this.scene.start('Scene4_Exit');
                } else {
                    if (!this.warningText) {
                        this.warningText = this.add.text(this.scale.width / 2, 24, "You must clear all chambers first!", { font: '18px monospace', fill: '#ff6677' }).setOrigin(0.5);
                        this.time.delayedCall(1500, () => { this.warningText.destroy(); this.warningText = null; });
                    }
                }
            }, null, this);
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        const particles = this.add.particles('spark');
        this.emitter = particles.createEmitter({
            x: this.player.x, y: this.player.y,
            speed: { min: -20, max: 20 },
            lifespan: 300,
            scale: { start: 0.2, end: 0 },
            quantity: 0,
            frequency: -1,
            blendMode: 'ADD'
        });
    }

    update() {
        if (this.taskActive) {
            this.emitter.setPosition(this.player.x, this.player.y);
            return;
        }

        const speed = 160;
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);

        if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

        this.emitter.setPosition(this.player.x, this.player.y);
        if (this.player.body.speed > 0) this.emitter.explode(1);
    }

    handleTask(obstacle) {
        if (this.taskActive) return;
        this.taskActive = true;

        this.player.body.setVelocity(0);
        this.cursors.left.reset(); this.cursors.right.reset();
        this.cursors.up.reset(); this.cursors.down.reset();

        const type = obstacle.taskType;
        const task = tasksData[type];
        if (!task) {
            obstacle.destroy();
            this.taskActive = false;
            return;
        }

        const overlayBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.75);
        const container = this.add.container(0, 0);
        container.add(overlayBg);

        const narration = this.add.text(this.scale.width / 2, 100, task.narration, { font: '18px monospace', fill: '#e6f7ff', align: 'center', wordWrap: { width: this.scale.width - 120 } }).setOrigin(0.5);
        container.add(narration);

        const title = this.add.text(this.scale.width / 2, 40, task.title, { font: '24px monospace', fill: '#00ffc9', fontStyle: 'bold' }).setOrigin(0.5);
        container.add(title);

        const buttons = [];
        const baseY = 210;
        const spacing = 70;
        const btnW = Math.min(640, this.scale.width - 160);
        const correctIndex = task.correct;

        task.options.forEach((opt, i) => {
            const y = baseY + i * spacing;
            const btn = this.add.rectangle(this.scale.width / 2, y, btnW, 56, 0xaaaaaa).setInteractive({ useHandCursor: true });
            const txt = this.add.text(this.scale.width / 2, y, opt, { font: '16px monospace', fill: '#000', align: 'center', wordWrap: { width: btnW - 20 } }).setOrigin(0.5);
            container.add(btn); container.add(txt);
            buttons.push(btn);

            btn.on('pointerdown', () => {
                if (i === correctIndex) {
                    this.sound.play('correct');
                    btn.fillColor = 0x00ff00;
                    buttons.forEach(b => b.removeInteractive()); // Disable all buttons
                    this.time.delayedCall(900, () => {
                        this.tasksCompleted.add(type);
                        obstacle.destroy();
                        container.destroy();
                        this.taskActive = false;
                    });
                } else {
                    this.sound.play('wrong');
                    btn.fillColor = 0xff0000;
                    if (buttons[correctIndex]) buttons[correctIndex].fillColor = 0x00ff00;
                    buttons.forEach(b => b.removeInteractive()); // Disable all buttons
                    this.time.delayedCall(1200, () => {
                        // ===== FIX: Replaced body.reset() with the more stable setPosition() =====
                        this.player.setPosition(this.cellSize * 1.5, this.cellSize * 1.5);
                        container.destroy();
                        this.taskActive = false;
                    });
                }
            });
        });

        // ===== 3. ADDED THE DYNAMIC HINT FROM TASKS DATA =====
        const hintText = `Hint: ${task.hint}`;
        const hint = this.add.text(this.scale.width / 2, this.scale.height - 50, hintText, {
            font: '16px monospace',
            fill: '#ffff88', // Bright yellow for attention
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: this.scale.width - 100 }
        }).setOrigin(0.5);
        container.add(hint);
    }
}

