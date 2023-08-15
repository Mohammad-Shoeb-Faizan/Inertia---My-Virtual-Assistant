// Selecting DOM elements
const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

// Function to speak a sentence
function speak(sentence) {
  const speech = new SpeechSynthesisUtterance(sentence);
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

// Function to greet based on the time of day
function greetBasedOnTime() {
  const currentHour = new Date().getHours();

  if (currentHour >= 0 && currentHour < 12) {
    speak("Good Morning Boss");
  } else if (currentHour === 12) {
    speak("Good Noon Boss");
  } else if (currentHour > 12 && currentHour <= 17) {
    speak("Good Afternoon Boss");
  } else {
    speak("Good Evening Boss");
  }
}

// Initialization
window.addEventListener("load", () => {
  speak("Activating Inertia");
  speak("Going online");
  greetBasedOnTime();
});

// Setting up SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Handling speech recognition results
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  content.textContent = transcript;
  processUserCommand(transcript.toLowerCase());
};

// Start speech recognition on button click
btn.addEventListener("click", () => {
  recognition.start();
});

// Function to fetch and speak weather information
function fetchWeather(city) {
  const apiKey = "ff6da724fd383c3ab01c37a1d33ef249";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;

        const weatherText = `The weather in ${city} is ${description}. The temperature is ${temperature}°C and the humidity is ${humidity}%.`;
        speak(weatherText);
      } else {
        speak(`Sorry, I couldn't retrieve the weather information for ${city}.`);
      }
    })
    .catch(() => {
      speak("Sorry, there was an error while fetching weather information.");
    });
}

// Dictionary to store reminders
const reminders = {};

// Function to set reminders
function setReminder(task, time) {
  const reminderTime = new Date(time);
  const currentTime = new Date();

  if (reminderTime > currentTime) {
    // Store the reminder with task as the key and reminder time as the value
    reminders[task] = reminderTime;
    speak(`Reminder set for ${task} at ${time}`);
  } else {
    speak("Sorry, the specified time is in the past. Please provide a valid time.");
  }
}

// Function to list upcoming reminders
function listUpcomingReminders() {
    const now = new Date();
    const upcomingReminders = [];
  
    for (const task in reminders) {
      if (reminders[task] > now) {
        upcomingReminders.push(`${task} at ${reminders[task].toLocaleTimeString()}`);
      }
    }
  
    if (upcomingReminders.length > 0) {
      speak("Here are your upcoming reminders:");
      upcomingReminders.forEach(reminder => speak(reminder));
    } else {
      speak("You don't have any upcoming reminders.");
    }
  }
  




// Function to process user commands
function processUserCommand(message) {
  let responseText = "I did not understand what you said. Please try again.";

  if (message.includes("hey") || message.includes("hello")) {
    responseText = "Hello Boss";
  } else if (message.includes("how are you")) {
    responseText = "I am fine boss. Tell me how can I help you?";
  } else if (message.includes("name")) {
    responseText = "My name is Inertia";
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    responseText = "Opening Google";
  } else if (message.includes("open instagram")) {
    window.open("https://instagram.com", "_blank");
    responseText = "Opening Instagram";
  } else if (message.includes("wikipedia")) {
    window.open(
      `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`,
      "_blank"
    );
    responseText = "Searching Wikipedia";
  } else if (message.includes("time")) {
    const time = new Date().toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    responseText = `The current time is ${time}`;
  } else if (message.includes("date")) {
    const date = new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    responseText = `Today's date is ${date}`;
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    responseText = "Opening Calculator";
  } else if (message.includes("weather")) {
    const city = message.split("in ")[1];
    if (city) {
      fetchWeather(city);
      return; // No need to set responseText here, as fetchWeather handles it
    } else {
      responseText = "Please provide a city name for weather information.";
    }
  }  else if (message.includes("set a reminder for")) {
    const regex = /set a reminder for (.*) at (.*)/i;
    const matches = message.match(regex);

    if (matches && matches.length >= 3) {
      const task = matches[1];
      const time = matches[2];
      setReminder(task, time);
    } else {
      responseText = "Please provide a valid reminder format: 'Set a reminder for [task] at [time]'";
    }
  } else if (message.includes("list upcoming reminders")) {
    listUpcomingReminders();
  }

  speak(responseText);
}

// Initiate speech synthesis with proper settings
function speak(response) {
  const speech = new SpeechSynthesisUtterance(response);
  speech.volume = 1;
  speech.pitch = 1;
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}
