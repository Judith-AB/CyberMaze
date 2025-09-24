export default class Scene4_Exit extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4_Exit' });
    }

    // 1. Preload the audio file
    preload() {
        this.load.audio('complete', 'assets/audio/complete.wav');
    }

    create() {
        // Stop any existing background music
        let bg = this.sound.get('bgmusic');
        if (bg) {
            bg.stop();
        }

        // 2. Play the sound once
        this.sound.play('complete');

        // --- Rest of your existing code ---
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x03040a, 1);
        this.add.text(this.scale.width / 2, 120, "Cyber Victory!", { font: '36px monospace', fill: '#00ffcc' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, 180, "You escaped the Cyber Maze with your data intact.", { font: '20px monospace', fill: '#e6f7ff' }).setOrigin(0.5);

        const notes = [
            "Phishing Buster - avoided phishing emails",
            "Password Guardian - picked strong passwords",
            "Scam Spotter - recognized fake websites",
            "Download Defender - avoided suspicious files",
            "OTP Resister - refused social engineering calls"
        ];

        for (let i = 0; i < notes.length; i++) {
            this.add.text(160, 260 + i * 32, "• " + notes[i], { font: '18px monospace', fill: '#bfefff' });
        }

        const restart = this.add.text(this.scale.width / 2, 480, "Play Again", { font: '20px monospace', fill: '#ff8888', backgroundColor: '#1a001a', padding: { x: 12, y: 8 } })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        restart.on('pointerdown', () => this.scene.start('Scene1_Opening'));
    }
}