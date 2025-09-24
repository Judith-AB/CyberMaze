// Each task has: title, narration, options (array), correct (index), and a hint
export const tasksData = {
    P: {
        title: "Phishing Email Challenge",
        narration: "Two emails have appeared. One asks to 'Update your bank details immediately — click here.' The other says 'Your bank never asks for details by email.' Which is safe?",
        options: [
            "Don't click. Log in via official app/web or contact bank",
            "Click the link and update bank details now"
        ],
        correct: 0,
        hint: "Banks prefer you to initiate contact through official channels you already trust."
    },

    S: {
        title: "Password Lock",
        narration: "Three locks appear with different passwords. Which is strongest and safest to use?",
        options: [
            "123456",
            "hehe2023",
            "H#9!bL7s@P"
        ],
        correct: 2,
        hint: "Complexity is key. Think about what a computer would find hardest to guess."
    },

    F: {
        title: "Fake Website Fork",
        narration: "Two website addresses appear. One is fake (looks similar, uses trick characters). Which is the real website?",
        options: [
            "www.paypa1.com (looks like PayPal but with a '1')",
            "www.paypal.com (official, with secure https)"
        ],
        correct: 1,
        hint: "The devil is in the details. Check every letter and symbol in the address bar."
    },

    D: {
        title: "Suspicious Download",
        narration: "A popup offers a free tablet if you click a link. Another message reminds you to only install apps from stores you trust. Which action is safe?",
        options: [
            "Ignore the popup and download only from official sources",
            "Click the popup to claim the free tablet"
        ],
        correct: 0,
        hint: "If an offer sounds too good to be true, it usually is. Free gifts can have a hidden cost."
    },

    C: {
        title: "Social Engineering Call",
        narration: "Caller ID shows 'Your Bank'. The caller asks for your OTP to 'secure your account'. What should you do?",
        options: [
            "Give the OTP to help them secure the account",
            "Hang up — banks never ask for OTPs; verify through official channels"
        ],
        correct: 1,
        hint: "An OTP is like a digital key for one-time use. Would you give your keys to someone over the phone?"
    },

    B: { 
        title: "The Biometrics Gate",
        narration: "You reach a security gate. A hacker has your password and is pretending to be you. How will you prove you are the real one?",
        options: [
            "Tell the guard your birthday and full name.",
            "Use your fingerprint or face scan on the biometric scanner.",
            "Type in an easy password like 1234."
        ],
        correct: 1,
        hint: "Some security is based on what you know, but the strongest is based on who you *are*."
    },

    H: { 
        title: "The Web Gate – HTTP vs HTTPS",
        narration: "A portal to the web has two doors: HTTP and HTTPS. Only one is safe. One has a padlock icon. Which door will keep your data safe?",
        options: [
            "Enter the HTTPS door (padlock icon).",
            "Enter the HTTP door (no padlock)."
        ],
        correct: 0,
        hint: "That little lock icon isn't just for decoration. It's a symbol of safety."
    },

    T: { // New Two-Factor Authentication Question
        title: "The Two-Factor Lock",
        narration: "You log into your email with your password. A second message appears asking for a special code sent to your phone. What should you do?",
        options: [
            "Enter the password and the special code from your phone.",
            "Ignore the code; the password should be enough security."
        ],
        correct: 0,
        hint: "One lock on a door is good, but two locks are much better for security."
    },

    I: { // New Public Wi-Fi Question
        title: "The Cafe Wi-Fi Choice",
        narration: "You are at a cafe using their free public Wi-Fi. You need to check your bank balance urgently. Is this a safe time to log in?",
        options: [
            "Log in to the bank account. It's urgent and the Wi-Fi is convenient.",
            "Wait until you are on a trusted, private network, like at home."
        ],
        correct: 1,
        hint: "Would you discuss secret financial details out loud in a crowded public room?"
    }
};