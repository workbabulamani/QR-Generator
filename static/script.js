document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.getElementById("create-btn");
    const downloadBtn = document.getElementById("download-btn");
    const textInput = document.getElementById("text-input");
    const qrPreview = document.getElementById("qr-preview");
    const charCount = document.getElementById("char-count");

    let generatedQRUrl = null;

    // Character counter
    textInput.addEventListener("input", () => {
        charCount.textContent = textInput.value.length;
    });

    // Generate QR Code
    createBtn.addEventListener("click", async () => {
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification("Please enter some content first!", "error");
            return;
        }

        // Disable button and show loading state
        createBtn.disabled = true;
        createBtn.style.opacity = "0.7";
        createBtn.innerHTML = '<span class="btn-icon">⏳</span><span>Generating...</span>';

        try {
            const response = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const blob = await response.blob();
                generatedQRUrl = URL.createObjectURL(blob);
                
                // Animate QR code appearance
                qrPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = generatedQRUrl;
                img.alt = 'Generated QR Code';
                qrPreview.appendChild(img);

                showNotification("QR code generated successfully! ✨", "success");
                downloadBtn.disabled = false;
            } else {
                showNotification("Error generating QR code. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification("Connection error. Please check your input and try again.", "error");
        } finally {
            createBtn.disabled = false;
            createBtn.style.opacity = "1";
            createBtn.innerHTML = '<span class="btn-icon">✨</span><span>Generate QR Code</span>';
        }
    });

    // Download QR Code
    downloadBtn.addEventListener("click", () => {
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification("Please generate a QR code first!", "error");
            return;
        }

        if (!generatedQRUrl) {
            showNotification("Please generate a QR code first!", "error");
            return;
        }

        const a = document.createElement("a");
        a.href = generatedQRUrl;
        a.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showNotification("QR code downloaded! 📥", "success");
    });

    // Notification system
    function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === "success" ? "#00d9ff" : type === "error" ? "#ff6b6b" : "#00d9ff"};
            color: ${type === "success" ? "#0f0f0f" : type === "error" ? "#fff" : "#0f0f0f"};
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = "slideOutRight 0.3s ease-out";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
});

// document.addEventListener("DOMContentLoaded", () => {
//     const createBtn = document.getElementById("create-btn");
//     const downloadBtn = document.getElementById("download-btn");
//     const textInput = document.getElementById("text-input");
//     const qrPreview = document.getElementById("qr-preview");

//     const textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
    
//     // Re-initialize all MDC components
//     mdc.autoInit();


//     createBtn.addEventListener("click", async () => {
//         const text = textInput.value;
//         if (!text) {
//             alert("Please enter some text.");
//             return;
//         }

//         const response = await fetch("/generate", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ text }),
//         });

//         if (response.ok) {
//             const blob = await response.blob();
//             const url = URL.createObjectURL(blob);
//             qrPreview.innerHTML = `<img src="${url}" alt="QR Code">`;
//         } else {
//             alert("Error generating QR code.");
//         }
//     });

//     downloadBtn.addEventListener("click", () => {
//         const text = textInput.value;
//         if (!text) {
//             alert("Please enter some text.");
//             return;
//         }
//         const url = `/download?text=${encodeURIComponent(text)}`;
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "qr_code.png";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     });
// });
