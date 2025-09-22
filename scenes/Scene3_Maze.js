import { tasksData } from '../data/tasksData.js';

export default class Scene3_Maze extends Phaser.Scene {
    constructor() { super({ key: 'Scene3_Maze' }); }

    create() {
        const cellSize = 48;
        this.taskActive = false;
        this.tasksCompleted = new Set();
        this.totalTasks = Object.keys(tasksData).length;

        // Maze layout (adjusted to fit 768x576)
        // W = wall, .=path, P=Phishing, S=Password, F=FakeWeb, D=Download, C=SocialEng, E=exit
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

        // simple neon wall style
        const wallFill = 0x081017;
        const wallStroke = 0x00d9ff;

        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[row].length; col++) {
                const x = col * cellSize + cellSize / 2 + 16; // slight padding
                const y = row * cellSize + cellSize / 2 + 16;
                const cell = this.maze[row][col];

                if (cell === 'W') {
                    const wall = this.add.rectangle(x, y, cellSize, cellSize, wallFill).setStrokeStyle(2, wallStroke, 1);
                    this.physics.add.existing(wall, true);
                    this.walls.add(wall);
                } else if ("PSFDC".includes(cell)) {
                    // neutral orange-ish tile; stroke for subtle glow
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

        // create a tiny spark texture for subtle particles (no external assets)
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xffffff, 1);
        g.fillCircle(2, 2, 2);
        g.generateTexture('spark', 4, 4);
        g.destroy();

        // player
        this.player = this.add.rectangle(48 + 16, 48 + 16, 32, 32, 0x00e6ff).setStrokeStyle(2, 0xffffff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.walls);

        // overlap handlers (do NOT destroy obstacle here; destroy only when correct)
        this.obstacles.getChildren().forEach(obs => {
            this.physics.add.overlap(this.player, obs, () => this.handleTask(obs), null, this);
        });

        // exit overlap
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

        // subtle particle emitter following the player
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
        // freeze movement if task overlay active
        if (this.taskActive) {
            // still update emitter position visually
            this.emitter.setPosition(this.player.x, this.player.y);
            return;
        }

        const speed = 160;
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);

        if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);

        // emitter follow
        this.emitter.setPosition(this.player.x, this.player.y);
        if (this.player.body.speed > 0) this.emitter.explode(1);
    }

    handleTask(obstacle) {
        if (this.taskActive) return;
        this.taskActive = true;

        // freeze player instantly & clear held keys so player won't drift after overlay closes
        this.player.body.setVelocity(0);
        this.cursors.left.reset(); this.cursors.right.reset();
        this.cursors.up.reset(); this.cursors.down.reset();

        // do NOT destroy obstacle yet; only remove on correct answer
        const type = obstacle.taskType;
        const task = tasksData[type];
        if (!task) {
            // safety: if task missing, remove and resume
            obstacle.destroy();
            this.taskActive = false;
            return;
        }

        // overlay (centered container)
        const overlayBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.75);
        const container = this.add.container(0, 0);
        container.add(overlayBg);

        // narration text
        const narration = this.add.text(this.scale.width / 2, 70, task.narration, { font: '18px monospace', fill: '#e6f7ff', wordWrap: { width: this.scale.width - 120 } }).setOrigin(0.5);
        container.add(narration);

        // title
        const title = this.add.text(this.scale.width / 2, 120, task.title, { font: '22px monospace', fill: '#00ffc9' }).setOrigin(0.5);
        container.add(title);

        // options buttons (support variable count)
        const buttons = [];
        const texts = [];
        const baseY = 210;
        const spacing = 70;
        const btnW = Math.min(640, this.scale.width - 160);

        // Determine correct index from tasksData
        const correctIndex = task.correct;

        task.options.forEach((opt, i) => {
            const y = baseY + i * spacing;
            const btn = this.add.rectangle(this.scale.width / 2, y, btnW, 56, 0xaaaaaa).setInteractive({ useHandCursor: true });
            const txt = this.add.text(this.scale.width / 2, y, opt, { font: '16px monospace', fill: '#000' }).setOrigin(0.5);
            container.add(btn); container.add(txt);
            buttons.push(btn); texts.push(txt);

            btn.on('pointerdown', () => {
                // reveal: correct green, wrong red
                if (i === correctIndex) {
                    btn.fillColor = 0x00ff00;
                    // set others red
                    buttons.forEach((b, idx) => { if (idx !== i) b.fillColor = 0xff0000; });
                    this.time.delayedCall(900, () => {
                        // mark complete, destroy container, remove obstacle
                        this.tasksCompleted.add(type);
                        obstacle.destroy();
                        container.destroy();
                        this.taskActive = false;
                    });
                } else {
                    btn.fillColor = 0xff0000;
                    // highlight correct
                    if (buttons[correctIndex]) buttons[correctIndex].fillColor = 0x00ff00;
                    this.time.delayedCall(900, () => {
                        // reset player position as penalty, do not remove obstacle
                        this.player.x = 48 + 16;
                        this.player.y = 48 + 16;
                        container.destroy();
                        this.taskActive = false;
                    });
                }
            });
        });

        // small hint: show which chamber type to the player (optional)
        const hint = this.add.text(this.scale.width / 2, this.scale.height - 50, "Complete the chamber to proceed", { font: '16px monospace', fill: '#bcdfff' }).setOrigin(0.5);
        container.add(hint);
    }
}
