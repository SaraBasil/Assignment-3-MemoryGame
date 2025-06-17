function navigateTo(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => screen.classList.add("hidden"));

  document.getElementById(screenId).classList.remove("hidden");
}

// Show home screen by default
document.getElementById("home-screen").classList.remove("hidden");
