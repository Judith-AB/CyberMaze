// Put your real task wording here. I used the tasks you described earlier.
// Each task has: title, narration, options (array), correct (index of correct option)
export const tasksData = {
    P: {
        title: "Phishing Email Challenge",
        narration: "Look! Two emails have appeared. One asks to 'Update your bank details immediately — click here.' The other says 'Your bank never asks for details by email. Use the official app.' Which is safe?",
        options: [
            "Click the link and update bank details now",
            "Don't click. Log in via official app/web or contact bank"
        ],
        correct: 1
    },

    S: {
        title: "Password Lock",
        narration: "Three locks appear with different passwords. Which is strongest and safest to use?",
        options: [
            "123456",
            "hehe2023",
            "H#9!bL7s@P"
        ],
        correct: 2
    },

    F: {
        title: "Fake Website Fork",
        narration: "Two website addresses appear. One is fake (looks similar, uses trick characters). Which is the real website?",
        options: [
            "www.paypa1.com (looks like PayPal but with a '1')",
            "www.paypal.com (official, with secure https)"
        ],
        correct: 1
    },

    D: {
        title: "Suspicious Download",
        narration: "A popup offers a free tablet if you click and enter your password. Another message reminds you to only install apps from people or stores you trust. Which action is safe?",
        options: [
            "Click the popup and enter password to claim free tablet",
            "Ignore the popup and download only from official app stores or verified sources"
        ],
        correct: 1
    },

    C: {
        title: "Social Engineering Call",
        narration: "Caller ID shows 'Your Bank'. The caller asks for your OTP to 'secure your account'. What should you do?",
        options: [
            "Give the OTP to help them secure the account",
            "Hang up — banks never ask for OTPs; verify through official channels"
        ],
        correct: 1
    }
};
