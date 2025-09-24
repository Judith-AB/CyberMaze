export default class Scene2_Avatar extends Phaser.Scene {
    constructor() { super({ key: 'Scene2_Avatar' }); }

    preload() {
        this.load.image('avatar_guy', 'assets/guy.png');
        this.load.image('avatar_girl', 'assets/girl.png');

        // 1. Load the sound effect
        this.load.audio('avatar_hover_sfx', 'assets/audio/avatar.wav');
    }

    create() {
        const titleText = this.add.text(this.scale.width / 2, 48, "Choose Your Cyber Hero", { font: '28px monospace', fill: '#00ffcc' }).setOrigin(0.5);

        const boyCard = this.createAvatarCard(240, 260, 'avatar_guy', 'Cyber Boy');
        const girlCard = this.createAvatarCard(528, 260, 'avatar_girl', 'Cyber Girl');
        
        const UIGroup = [titleText, boyCard, girlCard];

        [boyCard, girlCard].forEach(card => {
            const cardBackground = card.getAt(0);
            const avatarImage = card.getAt(1);

            card.on('pointerover', () => {
                // 2. Play the sound
                this.sound.play('avatar_hover_sfx');
                
                // Restore visual effects
                card.setScale(1.05);
                avatarImage.setTint(0x00ffcc);
                cardBackground.setStrokeStyle(4, 0x88ffff);
            });

            card.on('pointerout', () => {
                card.setScale(1);
                avatarImage.clearTint();
                cardBackground.setStrokeStyle(2, 0x00ffcc);
            });
        });

        boyCard.on('pointerdown', () => startTransition('boy', boyCard, girlCard));
        girlCard.on('pointerdown', () => startTransition('girl', boyCard, girlCard));

        const startTransition = (chosenAvatar, boy, girl) => {
            boy.disableInteractive();
            girl.disableInteractive();
            this.registry.set('avatar', chosenAvatar);

            const confirmText = this.add.text(this.scale.width / 2, this.scale.height / 2, "", {
                font: '24px monospace', fill: '#00ffcc'
            }).setOrigin(0.5).setAlpha(0);
            
            const width = this.scale.width;
            const height = this.scale.height;

            const vignette = this.add.graphics({ x: 0, y: 0 }).setAlpha(0);
            vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 1, 1);
            vignette.fillRect(0, 0, width, height);
            
            const scanline = this.add.rectangle(width / 2, -20, width, 10, 0x00ffcc, 0.3)
                .setBlendMode(Phaser.BlendModes.ADD);

            const timeline = this.tweens.createTimeline();

            timeline.add({ targets: UIGroup, alpha: 0, duration: 500, ease: 'Power1' });
            timeline.add({
                targets: confirmText, alpha: 1, duration: 500, offset: "-=250",
                onStart: () => this.scrambleText(confirmText, 'IDENTITY CONFIRMED', 1500)
            });
            timeline.add({ targets: scanline, y: height + 20, ease: 'Cubic.easeOut', duration: 2200, offset: 0 });
            timeline.add({ targets: vignette, alpha: 0.75, duration: 2500, offset: 0 });
            timeline.play();

            this.time.delayedCall(2800, () => {
                this.cameras.main.shake(300, 0.015);
                this.cameras.main.fade(400, 0, 0, 0, false, (camera, progress) => {
                    if (progress === 1) { this.scene.start('Scene3_Maze'); }
                });
            });
        };
    }

    createAvatarCard(x, y, imageKey, label) {
        const cardWidth = 200;
        const cardHeight = 340;
        const cardBackground = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x1a1a1a)
            .setStrokeStyle(2, 0x00ffcc);
        const avatarImage = this.add.image(0, -30, imageKey);
        const labelText = this.add.text(0, cardHeight / 2 - 35, label, {
            font: '18px monospace', fill: '#ffffff', backgroundColor: '#000000a0',
            padding: { x: 5, y: 3 }
        }).setOrigin(0.5);

        const maxImgWidth = cardWidth - 20;
        const maxImgHeight = cardHeight - 90;
        const scale = Math.min(maxImgWidth / avatarImage.width, maxImgHeight / avatarImage.height);
        avatarImage.setScale(scale);

        const cardContainer = this.add.container(x, y, [cardBackground, avatarImage, labelText]);
        cardContainer.setSize(cardWidth, cardHeight);
        cardContainer.setInteractive({ useHandCursor: true });
        return cardContainer;
    }

    scrambleText(textObject, final_text, duration) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        textObject.setText(" ".repeat(final_text.length));
        let step = 0;
        const steps = duration / 50;

        const scrambler = () => {
            if (step >= steps) {
                textObject.setText(final_text);
                return;
            }
            let scrambled = '';
            for (let i = 0; i < final_text.length; i++) {
                if (i < final_text.length * (step / steps)) {
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