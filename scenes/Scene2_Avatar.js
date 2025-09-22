export default class Scene2_Avatar extends Phaser.Scene {
    constructor() { super({ key: 'Scene2_Avatar' }); }

    create() {
        this.add.text(this.scale.width / 2, 48, "Choose Your Cyber Hero", { font: '28px monospace', fill: '#00ffcc' }).setOrigin(0.5);

        // Avatar placeholders
        const boy = this.add.rectangle(240, 240, 110, 140, 0x0fdfff).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });
        const girl = this.add.rectangle(528, 240, 110, 140, 0xff66ff).setStrokeStyle(4, 0xffffff).setInteractive({ useHandCursor: true });

        const boyText = this.add.text(boy.x, boy.y + 90, "Cyber Boy", { font: '18px monospace', fill: '#000' }).setOrigin(0.5);
        const girlText = this.add.text(girl.x, girl.y + 90, "Cyber Girl", { font: '18px monospace', fill: '#000' }).setOrigin(0.5);

        // hover
        [boy, girl].forEach(el => {
            el.on('pointerover', () => el.setScale(1.05));
            el.on('pointerout', () => el.setScale(1));
        });

        // on choose -> start maze (you can store avatar in registry if needed)
        boy.on('pointerdown', () => {
            this.registry.set('avatar', 'boy');
            this.scene.start('Scene3_Maze');
        });
        girl.on('pointerdown', () => {
            this.registry.set('avatar', 'girl');
            this.scene.start('Scene3_Maze');
        });
    }
}
