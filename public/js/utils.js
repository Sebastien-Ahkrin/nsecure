"use strict";

let activeLegendElement = null;

function formatBytes(bytes, decimals) {
    if (bytes === 0) {
        return "0 B";
    }
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const id = Math.floor(Math.log(bytes) / Math.log(1024));

    // eslint-disable-next-line
    return parseFloat((bytes / Math.pow(1024, id)).toFixed(dm)) + ' ' + sizes[id];
}

function createTooltip(icon, description) {
    const divElement = document.createElement("div");
    divElement.classList.add("tooltip");
    divElement.appendChild(document.createTextNode(icon));

    const spanElement = document.createElement("span");
    spanElement.classList.add("tooltiptext");
    spanElement.appendChild(document.createTextNode(description));

    divElement.appendChild(spanElement);

    return divElement;
}

function createAvatar(name, desc) {
    const divEl = document.createElement("div");
    divEl.classList.add("avatar");

    const pElement = document.createElement("p");
    pElement.classList.add("count");
    pElement.appendChild(document.createTextNode(desc.count));
    divEl.appendChild(pElement);

    const aElement = document.createElement("a");
    aElement.target = "_blank";
    aElement.href = desc.url || "#";

    const imgEl = document.createElement("img");
    if (desc.email === null) {
        imgEl.src = "/img/avatar-default.png";
    }
    else {
        const hash = md5(desc.email);
        imgEl.src = `https://gravatar.com/avatar/${hash}?&d=404`;
        imgEl.onerror = () => {
            imgEl.src = "/img/avatar-default.png";
        };
    }
    imgEl.alt = name;

    aElement.appendChild(imgEl);
    divEl.appendChild(aElement);

    return divEl;
}

function createLegend(icon, title) {
    const slicedTitle = title.length > 23 ? `${title.slice(0, 23)}..` : title;
    const legendDivElement = document.createElement("div");

    const iconPElement = document.createElement("p");
    const titleBElement = document.createElement("b");
    legendDivElement.classList.add("legend");
    legendDivElement.addEventListener("click", function legendClicked() {
        if (activeLegendElement !== null) {
            activeLegendElement.classList.remove("active");
        }
        activeLegendElement = legendDivElement;
        activeLegendElement.classList.add("active");
        updateDescription(title);
    });

    iconPElement.appendChild(document.createTextNode(icon));
    titleBElement.appendChild(document.createTextNode(slicedTitle));

    legendDivElement.appendChild(iconPElement);
    legendDivElement.appendChild(titleBElement);

    return legendDivElement;
}
function createLiField(title, value, isLink = false) {
    const liElement = document.createElement("li");
    const bElement = document.createElement("b");
    bElement.appendChild(document.createTextNode(title));


    liElement.appendChild(bElement);
    if (isLink) {
        const aElement = document.createElement("a");
        aElement.href = value;
        aElement.target = "_blank";

        const textValue = value.length > 26 ? `${value.slice(0, 26)}...` : value;
        aElement.appendChild(document.createTextNode(textValue));
        liElement.appendChild(aElement);
    }
    else {
        const pElement = document.createElement("p");
        pElement.appendChild(document.createTextNode(value));
        liElement.appendChild(pElement);
    }

    return liElement;
}

function renderItemsList(node, items = []) {
    if (items.length === 0) {
        const previousNode = node.previousElementSibling;
        if (previousNode !== null) {
            previousNode.style.display = "none";
        }

        return;
    }

    const fragment = document.createDocumentFragment();
    for (const elem of items) {
        if (elem.trim() === "") {
            continue;
        }
        const span = document.createElement("span");
        span.appendChild(document.createTextNode(elem));
        fragment.appendChild(span);
    }
    node.appendChild(fragment);
}

async function request(path, customHeaders = Object.create(null)) {
    const headers = {
        Accept: "application/json"
    };

    const raw = await fetch(path, {
        method: "GET",
        headers: Object.assign({}, headers, customHeaders)
    });

    return raw.json();
}

async function updateDescription(title) {
    const flagDescriptionElement = document.getElementById("flag-description");
    const description = await (await fetch(`flags/description/${title}`)).text();
    flagDescriptionElement.innerHTML = description;
}
