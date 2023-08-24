let headers = Array.from(document.querySelectorAll("h1:not(.no-nav), h2:not(.no-nav), h3:not(.no-nav), h4:not(.no-nav), h5:not(.no-nav), h6:not(.no-nav)"));

function createNavInside(elem) {
    let navListItems = [];
    let currentParent = elem;
    let lastElement = elem;
    let lastLevel = 0;
    headers.forEach(header => {
        let id = header.innerText.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
        header.id = id;
        let level = Number(header.tagName.slice(1));
        if (level > lastLevel) {
            currentParent = lastElement;
        } else {
            let levels = lastLevel - level;
            for (let i = 0; levels > i; i++) {
                currentParent = currentParent.parentElement.parentElement;
            }
        }
        let listItem = document.createElement("li");
        currentParent.appendChild(listItem);

        navListItems.push(listItem);

        let hyperlink = document.createElement("a");
        listItem.appendChild(hyperlink);
        hyperlink.href = "#" + id;
        hyperlink.innerText = header.innerText;

        let list = document.createElement("ul");
        listItem.appendChild(list);

        lastLevel = level;
        lastElement = list;
    });
}

let commonElements = document.getElementById("common-elements");
let siteSettings = document.getElementById("site-settings");

// if (window.location.pathname != "/index.html") {
//     let returnToIndex = document.createElement("a");
//     returnToIndex.href = (window.location.pathname.slice(-10) == "index.html") ? "../index.html" : "index.html";
//     returnToIndex.innerText = "Return to Index";
//     siteSettings.appendChild(returnToIndex);
//     returnToIndex.className = "home-link";
// }

let pageNav = document.createElement("ul");
pageNav.id = "page-nav";
commonElements.appendChild(pageNav);



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
siteSettings.appendChild(document.createElement("br"));
siteSettings.appendChild(darkModeButton);

updateTheme();

createNavInside(pageNav);