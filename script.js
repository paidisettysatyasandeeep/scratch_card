let canvas = document.getElementById("scratch");
let context = canvas.getContext("2d");

const init = () => {
  let gradientColor = context.createLinearGradient(0, 0, 135, 135);
  gradientColor.addColorStop(0, "#c3a3f1");
  gradientColor.addColorStop(1, "#6414e9");
  context.fillStyle = gradientColor;
  context.fillRect(0, 0, 200, 200);
};

let mouseX = 0;
let mouseY = 0;
let isDragged = false;

let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = "";

// Detect touch device
const isTouchDevice = () => {
  try {
    // We try to create TouchEvent. It would fail for desktops and throw an error.
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

// Get left and top of canvas
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;

// Exact x and y position of mouse/touch
const getXY = (e) => {
  mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
  mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
};

isTouchDevice();

// Function to hide the cursor
const hideCursor = () => {
  canvas.style.cursor = "none";
};

// Function to show the cursor
const showCursor = () => {
  canvas.style.cursor = "default";
};

canvas.addEventListener(events[deviceType].down, (event) => {
  isDragged = true;
  hideCursor();
  // Get x and y position
  getXY(event);
  scratch(mouseX, mouseY);
});

canvas.addEventListener(events[deviceType].move, (event) => {
  if (!isTouchDevice()) {
    event.preventDefault();
  }
  if (isDragged) {
    getXY(event);
    scratch(mouseX, mouseY);
  }
});

canvas.addEventListener(events[deviceType].up, () => {
  isDragged = false;
  showCursor();
});

canvas.addEventListener("mouseleave", () => {
  isDragged = false;
  showCursor();
});

const scratch = (x, y) => {
  // Destination-out draws new shapes behind the existing canvas content
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  // Arc makes a circle - x, y, radius, start angle, end angle
  context.arc(x, y, 12, 0, 2 * Math.PI);
  context.fill();
};

const generateAndStoreRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  localStorage.setItem("randomNumber", randomNumber);
};

const updateRandomAmount = () => {
  const randomAmountElement = document.getElementById("randomAmount");
  const storedRandomNumber = localStorage.getItem("randomNumber");

  if (storedRandomNumber !== null) {
    randomAmountElement.textContent = `${storedRandomNumber}%`;
  } else {
    generateAndStoreRandomNumber();
    updateRandomAmount();
  }
};

window.onload = () => {
  init();
  updateRandomAmount();
};
