document.addEventListener('DOMContentLoaded', function() {
    // Hide loading animation after 2 seconds
    setTimeout(() => {
        document.querySelector('.loading-animation').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-animation').style.display = 'none';
        }, 500);
    }, 2000);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Chat functionality
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const voiceButton = document.getElementById('voice-button');

    // Add initial bot message with animation
    setTimeout(() => {
        const initialMessage = document.querySelector('.bot-message');
        initialMessage.style.animation = 'messageAppear 0.3s ease';
    }, 500);

    // Function to add a new message to the chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.innerHTML = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(messageContent);
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const icon = document.createElement('i');
        icon.className = isUser ? 'fas fa-user' : 'fas fa-robot';
        avatar.appendChild(icon);
        messageDiv.appendChild(avatar);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        setTimeout(() => {
            messageDiv.style.animation = 'messageAppear 0.3s ease';
        }, 10);
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator.style.display = 'flex';
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator.style.display = 'none';
    }

    // Function to send message to Gemini API
    async function sendToGemini(message) {
        const API_KEY = 'AIzaSyDBe7yFTcdEYlM0UmS8sAfvLRaOMP3ioik';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        try {
            showTypingIndicator();
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });
            
            const data = await response.json();
            hideTypingIndicator();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "I'm sorry, I couldn't process your request. Please try again.";
            }
        } catch (error) {
            hideTypingIndicator();
            console.error('Error:', error);
            return "An error occurred while processing your request.";
        }
    }

    // Handle send button click
    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            const botResponse = await sendToGemini(message);
            addMessage(botResponse, false);
        }
    });

    // Handle Enter key press
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                
                const botResponse = await sendToGemini(message);
                addMessage(botResponse, false);
            }
        }
    });

    // Voice recognition
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        voiceButton.addEventListener('click', () => {
            recognition.start();
            voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceButton.style.backgroundColor = 'var(--accent-color)';
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.style.backgroundColor = 'var(--primary-color)';
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.style.backgroundColor = 'var(--primary-color)';
        };
        
        recognition.onend = () => {
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.style.backgroundColor = 'var(--primary-color)';
        };
    } else {
        voiceButton.style.display = 'none';
    }

    // Add some animations to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Add pulse animation to logo
    const logo = document.querySelector('.logo');
    setInterval(() => {
        logo.classList.toggle('pulse');
    }, 5000);
});