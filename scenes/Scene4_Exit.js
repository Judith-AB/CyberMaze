export default class Scene4_Exit extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4_Exit' });
    }

    preload() {
        this.load.audio('complete', 'assets/audio/complete.wav');
        this.load.image('finish', 'assets/finish.png');
    }

    create() {
        // --- Sound Management ---
        let bg = this.sound.get('bgmusic');
        if (bg) {
            bg.stop();
        }
        this.sound.play('complete');

        // --- Background ---
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x03040a, 1);

        // --- Left Side: Victory Image ---
        // Place the image on the left and make it larger
        const victoryImage = this.add.image(this.scale.width * 0.25, this.scale.height / 2, 'finish')
            .setScale(0.8) // Increased the scale for a bigger image
            .setAlpha(0);  // Start transparent for fade-in effect

        // --- Right Side: Victory Text ---
        const rightColumnX = this.scale.width * 0.65;

        // Title
        const title = this.add.text(rightColumnX, 120, "Cyber Victory!", {
            font: '48px monospace', // Made font larger
            fill: '#00ffcc',
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(rightColumnX, 180, "You escaped the Cyber Maze!", {
            font: '22px monospace',
            fill: '#e6f7ff',
            align: 'center'
        }).setOrigin(0.5);

        // List of Accomplishments
        const notes = [
            "Phishing Buster",
            "Password Guardian",
            "Scam Spotter",
            "Download Defender",
            "OTP Resister"
        ];

        for (let i = 0; i < notes.length; i++) {
            this.add.text(rightColumnX, 260 + i * 40, "✓ " + notes[i], {
                font: '20px monospace',
                fill: '#bfefff'
            }).setOrigin(0.5);
        }

        // --- Restart Button ---
        const restart = this.add.text(rightColumnX, 480, "Play Again", {
            font: '24px monospace',
            fill: '#ff8888',
            backgroundColor: '#1a001a',
            padding: { x: 16, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        // --- Animations and Effects ---

        // Scene fade-in
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // Image tween: slide in from left and fade in
        this.tweens.add({
            targets: victoryImage,
            x: this.scale.width * 0.3, // Final X position
            alpha: 1,
            ease: 'Power2',
            duration: 1500,
            delay: 500 // Start after a short delay
        });

        // Title "breathing" effect
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Button hover effects
        restart.on('pointerover', () => {
            restart.setBackgroundColor('#5e005e'); // Highlight color
            restart.setFill('#ffffff');
        });
        restart.on('pointerout', () => {
            restart.setBackgroundColor('#1a001a');
            restart.setFill('#ff8888');
        });

        restart.on('pointerdown', () => this.scene.start('Scene1_Opening'));
    }
}