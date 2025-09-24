export default class Scene1_Opening extends Phaser.Scene {
    constructor() { super({ key: 'Scene1_Opening' }); }

    preload() {
        this.load.audio('bgmusic', [
            'assets/audio/bgmusic.mp3',
            'assets/audio/bgmusic.ogg'
        ]);

        this.load.audio('glitch', [
            'assets/audio/glitch.mp3',
            'assets/audio/glitch.ogg'
        ]);

        // ===== 1. PRELOAD THE START BUTTON SOUND =====
        this.load.audio('start_sfx', 'assets/audio/start.wav');
    }

    create() {
        // ===== prepare background music (DO NOT re-play if already present) =====
        if (!this.sound.get('bgmusic')) {
            this.bgMusic = this.sound.add('bgmusic', { loop: true, volume: 0 });
        } else {
            this.bgMusic = this.sound.get('bgmusic');
        }

        try {
            if (!this.bgMusic.isPlaying) {
                this.bgMusic.play();
            }
        } catch (e) {
            // ignore — we'll start it on user gesture below
        }

        // ===== UI / Background grid =====
        const gfx = this.add.graphics();
        gfx.lineStyle(1, 0x112244, 0.12);
        for (let i = 0; i <= this.scale.width; i += 32) gfx.lineBetween(i, 0, i, this.scale.height);
        for (let j = 0; j <= this.scale.height; j += 32) gfx.lineBetween(0, j, this.scale.width, j);

        this.add.text(this.scale.width / 2, 80, "Cyber Maze", { font: '36px monospace', fill: '#00ffcc' }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, 140, "Learn to spot online threats and stay safe!", { font: '18px monospace', fill: '#bfeeff' }).setOrigin(0.5);

        const hint = this.add.text(this.scale.width / 2, this.scale.height - 32, "Click / press any key to enable audio", {
            font: '14px monospace', fill: '#cfdfff'
        }).setOrigin(0.5);

        const hideHint = () => {
            this.tweens.add({ targets: hint, alpha: 0, duration: 300, ease: 'Power1' });
        };

        const enableAudio = () => {
            if (this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }

            if (!this.bgMusic.isPlaying) {
                try {
                    this.bgMusic.play();
                } catch (e) {}
            }

            this.tweens.add({
                targets: this.bgMusic,
                volume: 0.5,
                duration: 1800,
                ease: 'Linear'
            });

            hideHint();
            this.input.off('pointerdown', enableAudio);
            this.input.keyboard.off('keydown', enableAudio);
        };

        this.input.once('pointerdown', enableAudio);
        this.input.keyboard.once('keydown', enableAudio);

        try { enableAudio(); } catch (e) {}

        const btn = this.add.text(this.scale.width / 2, 420, "Enter the Maze", {
            font: '24px monospace',
            fill: '#fff',
            backgroundColor: '#001122',
            padding: { x: 16, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ fill: '#00ffee' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));

        btn.on('pointerdown', () => {
            // ===== 2. PLAY THE SOUND ON CLICK =====
            this.sound.play('start_sfx');

            btn.disableInteractive();

            this.scrambleText(btn, 'ACCESSING...', 1500);

            const width = this.scale.width;
            const height = this.scale.height;

            const vignette = this.add.graphics({ x: 0, y: 0 }).setAlpha(0);
            vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 1, 1);
            vignette.fillRect(0, 0, width, height);
            
            const scanline = this.add.rectangle(width / 2, -20, width, 10, 0x00ffcc, 0.3)
                .setBlendMode(Phaser.BlendModes.ADD);

            const timeline = this.tweens.createTimeline();

            timeline.add({
                targets: btn,
                alpha: 0,
                duration: 500,
                delay: 1500
            });

            timeline.add({
                targets: scanline,
                y: height + 20,
                ease: 'Cubic.easeOut',
                duration: 2200,
                offset: 0
            });
            
            timeline.add({
                targets: vignette,
                alpha: 0.75,
                duration: 2500,
                offset: 0
            });

            timeline.play();

            this.time.delayedCall(2800, () => {
                this.cameras.main.shake(300, 0.015);
                this.cameras.main.fade(400, 0, 0, 0, false, (camera, progress) => {
                    if (progress === 1) {
                        this.scene.start('Scene2_Avatar');
                    }
                });
            });
        });
    }

    scrambleText(textObject, final_text, duration) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const original_text = textObject.text;
        let step = 0;
        const steps = duration / 50;

        const scrambler = () => {
            if (step >= steps) {
                textObject.setText(final_text);
                return;
            }

            let scrambled = '';
            for (let i = 0; i < original_text.length; i++) {
                const progress = step / steps;
                if (i < original_text.length * progress) {
                    scrambled += final_text[i] || ' ';
                } else {
                    scrambled += chars.charAt(Math.floor(Math.random() * chars.length));
                }
            }
            textObject.setText(scrambled);

            step++;
            this.time.delayedCall(50, scrambler);
        };

        scrambler();
    }
}