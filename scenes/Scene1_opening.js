export default class Scene1_Opening extends Phaser.Scene {
    constructor() { super({ key: 'Scene1_Opening' }); }

    create() {
        // simple neon grid background
        const gfx = this.add.graphics();
        gfx.lineStyle(1, 0x112244, 0.12);
        for (let i = 0; i <= this.scale.width; i += 32) gfx.lineBetween(i, 0, i, this.scale.height);
        for (let j = 0; j <= this.scale.height; j += 32) gfx.lineBetween(0, j, this.scale.width, j);

        this.add.text(this.scale.width / 2, 80, "Cyber Maze", { font: '36px monospace', fill: '#00ffcc' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, 140, "Learn to spot online threats and stay safe!", { font: '18px monospace', fill: '#bfeeff' }).setOrigin(0.5);

        const btn = this.add.text(this.scale.width / 2, 420, "Enter the Maze", { font: '24px monospace', fill: '#fff', backgroundColor: '#001122', padding: { x: 16, y: 10 } })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#00ffee' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));
        btn.on('pointerdown', () => this.scene.start('Scene2_Avatar'));
    }
}
