// Check browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Your browser does not support the Web Speech API.");
}

// Initialize recognition
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = false;

const startBtn = document.getElementById('startBtn');
const statusDiv = document.getElementById('status');

// Keep track of which field we're filling
let currentField = 0;
const formFields = ['name', 'email', 'message'];

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}

// Start voice recognition
startBtn.addEventListener('click', () => {
  statusDiv.textContent = "Listening...";
  recognition.start();
});

// When voice is received
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  const fieldId = formFields[currentField];
  const input = document.getElementById(fieldId);
  input.value = transcript;

  statusDiv.textContent = `Filled "${fieldId}" with: ${transcript}`;
  speak(`Filled ${fieldId} with ${transcript}`);

  currentField++;

  if (currentField < formFields.length) {
    setTimeout(() => {
      speak(`Please say your ${formFields[currentField]}`);
      recognition.start();
    }, 1500);
  } else {
    speak("Form is complete. Say 'submit' to submit the form.");
    statusDiv.textContent = "All fields filled. Awaiting submit.";
    listenForSubmit();
  }
};

recognition.onerror = (event) => {
  statusDiv.textContent = `Error: ${event.error}`;
};

function listenForSubmit() {
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();

    if (command.includes("submit")) {
      document.getElementById("voiceForm").submit();
      speak("Form submitted. Thank you!");
    } else {
      speak("Say 'submit' to submit the form or try again.");
      recognition.start();
    }
  };

  recognition.start();
}
