Array.from(document.querySelectorAll(".project")).forEach(elem => {
  
});



function toggleTheme() {
  let theme = localStorage.getItem("theme");
  if (theme == "light") {
      localStorage.setItem("theme", "dark");
  } else {
      localStorage.setItem("theme", "light");
  }
  updateTheme();
}

function updateTheme() {
  let theme = localStorage.getItem("theme");
  if (theme == "dark") {
      document.body.className = "dark";
  } else if (theme == null) {
      if (matchMedia("(prefers-color-scheme: dark)").matches) {
          localStorage.setItem("theme", "dark");
      } else {
          localStorage.setItem("theme", "light");
      }
      updateTheme();
  } else {
      document.body.className = "";
  }
}

let darkModeButton = document.createElement("button");
darkModeButton.innerText = "Toggle Dark/Light Theme";
darkModeButton.onclick = toggleTheme;

updateTheme();