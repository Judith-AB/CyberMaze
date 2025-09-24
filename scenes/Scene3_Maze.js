import { tasksData } from '../data/tasksData.js';

export default class Scene3_Maze extends Phaser.Scene {
    constructor() { super({ key: 'Scene3_Maze' }); }

    preload() {
        this.load.image('guyhead', 'assets/guyhead.png');
        this.load.image('girlhead', 'assets/girlhead.png');

        // ===== 1. ADD THIS TO PRELOAD YOUR SOUNDS =====
        // Make sure your sound files are in 'assets/audio/' or update the path.
        this.load.audio('correct', 'assets/audio/correct.wav');
        this.load.audio('wrong', 'assets/audio/wrong.wav');
    }

    create() {
        const cellSize = 48;
        this.taskActive = false;
        this.tasksCompleted = new Set();
        this.totalTasks = Object.keys(tasksData).length;

        // Maze layout (adjusted to fit 768x576)
        this.maze = [
            "WWWWWWWWWWWWWWWW",
            "W..P......F....W",
            "W.W.W.WW.W.W.W.W",
            "W..S..D......W.W",
            "W.WWWWWW.W.W.W.W",
            "W.....C......E.W",
            "WWWWWWWWWWWWWWWW"
        ];

        this.walls = this.add.group();
        this.obstacles = this.add.group();
        this.exit = null;

        const wallFill = 0x081017;
        const wallStroke = 0x00d9ff;

        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[row].length; col++) {
                const x = col * cellSize + cellSize / 2 + 16;
                const y = row * cellSize + cellSize / 2 + 16;
                const cell = this.maze[row][col];

                if (cell === 'W') {
                    const wall = this.add.rectangle(x, y, cellSize, cellSize, wallFill).setStrokeStyle(2, wallStroke, 1);
                    this.physics.add.existing(wall, true);
                    this.walls.add(wall);
                } else if ("PSFDC".includes(cell)) {
                    const obs = this.add.rectangle(x, y, cellSize - 4, cellSize - 4, 0xdfb07b).setStrokeStyle(2, 0xffffff, 0.5);
                    this.physics.add.existing(obs, true);
                    obs.taskType = cell;
                    this.obstacles.add(obs);
                } else if (cell === 'E') {
                    this.exit = this.add.rectangle(x, y, cellSize - 4, cellSize - 4, 0x00ff88).setStrokeStyle(2, 0xffffff, 0.8);
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
        this.player = this.add.image(48 + 16, 48 + 16, playerImageKey);
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
                        this.warningText = this.add.text(this.scale.width / 2, 8, "You must clear all chambers first!", { font: '18px monospace', fill: '#ff6677' }).setOrigin(0.5);
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

        const narration = this.add.text(this.scale.width / 2, 70, task.narration, { font: '18px monospace', fill: '#e6f7ff', wordWrap: { width: this.scale.width - 120 } }).setOrigin(0.5);
        container.add(narration);

        const title = this.add.text(this.scale.width / 2, 120, task.title, { font: '22px monospace', fill: '#00ffc9' }).setOrigin(0.5);
        container.add(title);

        const buttons = [];
        const texts = [];
        const baseY = 210;
        const spacing = 70;
        const btnW = Math.min(640, this.scale.width - 160);

        const correctIndex = task.correct;

        task.options.forEach((opt, i) => {
            const y = baseY + i * spacing;
            const btn = this.add.rectangle(this.scale.width / 2, y, btnW, 56, 0xaaaaaa).setInteractive({ useHandCursor: true });
            const txt = this.add.text(this.scale.width / 2, y, opt, { font: '16px monospace', fill: '#000' }).setOrigin(0.5);
            container.add(btn); container.add(txt);
            buttons.push(btn); texts.push(txt);

            btn.on('pointerdown', () => {
                if (i === correctIndex) {
                    // ===== 2. PLAY CORRECT SOUND =====
                    this.sound.play('correct');

                    btn.fillColor = 0x00ff00;
                    buttons.forEach((b, idx) => { if (idx !== i) b.fillColor = 0xff0000; });
                    this.time.delayedCall(900, () => {
                        this.tasksCompleted.add(type);
                        obstacle.destroy();
                        container.destroy();
                        this.taskActive = false;
                    });
                } else {
                    // ===== 3. PLAY WRONG SOUND =====
                    this.sound.play('wrong');

                    btn.fillColor = 0xff0000;
                    if (buttons[correctIndex]) buttons[correctIndex].fillColor = 0x00ff00;
                    this.time.delayedCall(900, () => {
                        this.player.x = 48 + 16;
                        this.player.y = 48 + 16;
                        container.destroy();
                        this.taskActive = false;
                    });
                }
            });
        });

        const hint = this.add.text(this.scale.width / 2, this.scale.height - 50, "Complete the chamber to proceed", { font: '16px monospace', fill: '#bcdfff' }).setOrigin(0.5);
        container.add(hint);
    }
}