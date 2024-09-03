document.addEventListener("DOMContentLoaded", function () {
    const heading = document.getElementById("heading");

    // Apply bounce effect using JavaScript
    function bounceEffect() {
        heading.style.animation = "bounce 2s infinite";
    }

    // Trigger bounce effect after fade-in animation
    setTimeout(bounceEffect, 1500); // 1.5 seconds to match the fadeInUp duration
});

// CSS Keyframes for bounce effect
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
    }
`, styleSheet.cssRules.length);