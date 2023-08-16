// Selecting DOM elements
const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

// Initialization
window.addEventListener("load", () => {
  initializeAssistant();
});

// Initialize the assistant
function initializeAssistant() {
  speak("Activating Inertia");
  speak("Going online");
  greetBasedOnTime();
  startSpeechRecognition();
}

// Function to speak a sentence
function speak(sentence) {
  const speech = new SpeechSynthesisUtterance(sentence);
  speech.volume = 1;
  speech.pitch = 1;
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}

// Function to start speech recognition
function startSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  // recognition.continuous = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    processUserCommand(transcript.toLowerCase());
  };

  btn.addEventListener("click", () => {
    recognition.start();
  });
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
        speak(
          `Sorry, I couldn't retrieve the weather information for ${city}.`
        );
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
    speak(
      "Sorry, the specified time is in the past. Please provide a valid time."
    );
  }
}

// Function to list upcoming reminders
function listUpcomingReminders() {
  const now = new Date();
  const upcomingReminders = [];

  for (const task in reminders) {
    if (reminders[task] > now) {
      upcomingReminders.push(
        `${task} at ${reminders[task].toLocaleTimeString()}`
      );
    }
  }

  if (upcomingReminders.length > 0) {
    speak("Here are your upcoming reminders:");
    upcomingReminders.forEach((reminder) => speak(reminder));
  } else {
    speak("You don't have any upcoming reminders.");
  }
}

// Function to define words using a dictionary API
function defineWord(word) {
  const apiKey = "9dba1189-dff2-437f-86f0-c510781629d3";
  const apiUrl = `https://api.dictionary.com/api/v3/references/learners/json/${word}?key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const firstDefinition = data[0].shortdef[0];
        speak(`The definition of "${word}" is: ${firstDefinition}`);
      } else {
        speak(`Sorry, I couldn't find a definition for "${word}".`);
      }
    })
    .catch(() => {
      speak("Sorry, there was an error while fetching the definition.");
    });
}

// Function to fetch a random joke from JokeAPI
async function getRandomJokeFromAPI() {
  const apiUrl = "https://v2.jokeapi.dev/joke/Any";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.type === "single") {
      return data.joke;
    } else if (data.type === "twopart") {
      return `${data.setup} ${data.delivery}`;
    } else {
      return "I couldn't find a joke at the moment.";
    }
  } catch (error) {
    return "Sorry, there was an error fetching a joke.";
  }
}

// Function to perform complex math calculations using math.js
function performComplexCalculation(expression) {
  try {
    const result = math.evaluate(expression);
    return result;
  } catch (error) {
    return "Sorry, I couldn't perform the calculation.";
  }
}

// Function to fetch news updates using NewsAPI
function fetchNews(topic) {
  const apiKey = "8a4ad43954c548a9a9d8692d6e9edd9b";
  const apiUrl = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}`;

  $.ajax({
    url: apiUrl,
    method: "GET",
    success: function (data) {
      if (data.articles && data.articles.length > 0) {
        const topNews = data.articles.slice(0, 5); // Limit to top 5 news
        topNews.forEach((news, index) => {
          const newsText = `${index + 1}. ${news.title}`;
          speak(newsText);
        });
      } else {
        speak("Sorry, I couldn't find any news updates.");
      }
    },
    error: function () {
      speak("Sorry, there was an error fetching news updates.");
    },
  });
}

// Function to set an alarm
function setAlarm(alarmTime) {
  const currentTime = new Date();
  const [hours, minutes] = alarmTime.split(":");
  const alarmDateTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    hours,
    minutes
  );

  const timeUntilAlarm = alarmDateTime - currentTime;
  if (timeUntilAlarm > 0) {
    setTimeout(() => {
      speak(`Alarm for ${alarmTime} is ringing!`);
    }, timeUntilAlarm);
    speak(`Alarm set for ${alarmTime}`);
  } else {
    speak("Please provide a future time for the alarm.");
  }
}

function findNearbyPlaces(type) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const nominatim = new NominatimJS();
      const response = await nominatim.reverse({
        lat: latitude,
        lon: longitude,
        format: "json",
      });

      if (response && response.length > 0) {
        const address = response[0].address;
        if (address[type]) {
          const nearbyType = address[type];
          speak(`Here are some nearby ${type}: ${nearbyType}`);
        } else {
          speak(`No nearby ${type} found.`);
        }
      } else {
        speak(`Sorry, couldn't find any nearby locations.`);
      }
    });
  } else {
    speak("Geolocation is not available in your browser.");
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
  } else if (message.includes("open youtube")) {
    responseText = "Opening Youtube Sir";
    window.open("https://www.youtube.com/", "_blank");
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
  } else if (message.includes("set a reminder for")) {
    const regex = /set a reminder for (.*) at (.*)/i;
    const matches = message.match(regex);

    if (matches && matches.length >= 3) {
      const task = matches[1];
      const time = matches[2];
      setReminder(task, time);
    } else {
      responseText =
        "Please provide a valid reminder format: 'Set a reminder for [task] at [time]'";
    }
  } else if (message.includes("list upcoming reminders")) {
    listUpcomingReminders();
  } else if (message.includes("what does")) {
    const regex = /what does (.*) mean/i;
    const matches = message.match(regex);

    if (matches && matches.length >= 2) {
      const word = matches[1];
      defineWord(word);
    } else {
      responseText =
        "Please provide a valid query format: 'What does [word] mean?'";
    }
  } else if (message.includes("tell me a joke")) {
    const randomJoke = getRandomJokeFromAPI();
    speak(randomJoke);
  } else if (message.includes("calculate")) {
    const expression = message.replace("calculate", "").trim();
    const result = performComplexCalculation(expression);
    speak(`The result of ${expression} is ${result}`);
  } else if (message.includes("news about")) {
    const topic = message.replace("news about", "").trim();
    fetchNews(topic);
  } else if (message.includes("set an alarm for")) {
    const regex = /set an alarm for (.*)/i;
    const matches = message.match(regex);

    if (matches && matches.length >= 2) {
      const alarmTime = matches[1];
      setAlarm(alarmTime);
    } else {
      responseText =
        "Please provide a valid alarm format: 'Set an alarm for [time]'";
    }
  } else if (message.includes("find nearby")) {
    const type = message.replace("find nearby", "").trim();
    findNearbyPlaces(type);
  } else if (
    message.includes("open firebase") ||
    message.includes("open fire base")
  ) {
    responseText = "Opening Firebase Console";
    window.open("https://console.firebase.google.com/", "_blank");
  } else if (message.includes("search for")) {
    const searchTerm = message.replace("search for", "").trim();
    if (searchTerm) {
      responseText = `Searching for ${searchTerm}`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      window.open(searchUrl);
    } else {
      responseText = "Please specify something to search for.";
    }
  } else if (message.includes("play")) {
    const searchTerm = message.replace("play", "").trim();
    if (searchTerm) {
      responseText = `playing ${searchTerm}`;
      const searchUrl = `https://www.youtube.com/search?q=${encodeURIComponent(
        searchTerm
      )}`;
      window.open(searchUrl);
    }
  } else if (message.includes("open github")) {
    responseText = "Opening GitHub";
    window.open("https://github.com/", "_blank");
  } else if (
    message.includes("shut down inertia") ||
    message.includes("shutdown inertia")
  ) {
    responseText = "Okay, I'll take a nap sir";
    recognition.stop();
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
