const keyLayouts = {
    en: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "shift",
        "en", "left", "space", "right", "sound", "mic"
    ],

    enShift: [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", "<", ">", "/", "shift",
        "en", "left", "space", "right", "sound", "mic"
    ],

    ru: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "shift",
        "ru", "left", "space", "right", "sound", "mic"
    ],

    ruShift: [
        "!", "?", ";", "№", ":", "*", "(", ")", "-", "+", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "shift",
        "ru", "left", "space", "right", "sound", "mic"
    ]
};


const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        textField: document.getElementById("text-field")
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shiftProp: false,
        lang: true,
        sound: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    this.elements.textField.focus();
                });
            });
        });
    },

    _createKeys() {
        console.log("_createKeys()");
        const fragment = document.createDocumentFragment();

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };


        console.log(this.properties.lang);

        keyLayouts.en.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "]", "ъ", "enter", "shift"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                        this._toggleSound("error");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        this._toggleSound("camera-flash");
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        this._toggleSound("fuzzy-beep");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                        this._toggleSound("click-on");
                    });

                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

                    let i = 0;
                    document.addEventListener("click", () => {
                        if (keyElement.contains(event.target)) {
                            i++;
                            this.elements.textField.focus();
                            this.elements.textField.setSelectionRange(-1, (this.properties.value.length - i) );
                            this._toggleSound("click-on");
                        } else {
                            i = 0;
                        }
                    });
                    /*keyElement.addEventListener("click", () => {
                        this.elements.textField.focus();
                        this.elements.textField.setSelectionRange(-1, (this.properties.value.length -1));
                        this._toggleSound("click-on");
                    });*/

                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

                    let j = 0;
                    document.addEventListener("click", () => {
                        if (keyElement.contains(event.target)) {
                            j++;
                            this.elements.textField.focus();
                            this.elements.textField.setSelectionRange(-1, (this.properties.value.length + j) );
                            this._toggleSound("click-on");
                        } else {
                            j = 0;
                        }
                    });

                    /*keyElement.addEventListener("click", () => {
                        this.elements.textField.focus();
                        this.elements.textField.setSelectionRange(-1, (this.properties.value.length + 1));
                        this._toggleSound("click-on");
                    });*/

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    //keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.innerHTML = createIconHTML("keyboard_hide");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = `<b>shift</b>`;

                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.shiftProp);
                        this._toggleSound("stapler");
                    });

                    break;

                case "en":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerText = `en`;

                    keyElement.addEventListener("click", () => {
                        this._toggleLang();
                        keyElement.classList.toggle(this.properties.lang);
                        this._toggleSound("a-tone");
                    });

                    break;

                case "sound":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("volume_up");

                    keyElement.addEventListener("click", () => {
                        this._toggleSound();
                        this.properties.sound = !this.properties.sound;
                        keyElement.classList.toggle("keyboard__key--active");
                    });

                    break;

                case "mic":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("mic");

                    keyElement.addEventListener("click", () => {
                        console.log("был нажат mic");
                        keyElement.classList.toggle("keyboard__key--active");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        //this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this.properties.value += keyElement.textContent;
                        this._triggerEvent("oninput");

                        if (this.properties.lang) {
                            this._toggleSound("clicks");
                        } else {
                            this._toggleSound("click-ru");
                        }

                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },


    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shiftProp = !this.properties.shiftProp;
        console.log("shift " + this.properties.shiftProp);

        if (this.properties.shiftProp && this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = (item.textContent == item.textContent.toUpperCase()) ? keyLayouts.enShift[i].toLowerCase() : keyLayouts.enShift[i].toUpperCase();
                }
            });
        } else if (!this.properties.shiftProp && this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = (item.textContent == item.textContent.toUpperCase()) ? keyLayouts.en[i].toLowerCase() : keyLayouts.en[i].toUpperCase();
                }
            });
        } else if (this.properties.shiftProp && !this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = (item.textContent == item.textContent.toUpperCase()) ? keyLayouts.ruShift[i].toLowerCase() : keyLayouts.ruShift[i].toUpperCase();
                }
            });
        } else {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = (item.textContent == item.textContent.toUpperCase()) ? keyLayouts.ru[i].toLowerCase() : keyLayouts.ru[i].toUpperCase();
                }
            });
        }
    },

    _toggleLang() {
        this.properties.lang = !this.properties.lang;
        console.log("en " + this.properties.lang);

        if (this.properties.shiftProp && this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.enShift[i];
                }
            });
        } else if (!this.properties.shiftProp && this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.en[i];
                }
            });
        } else if (this.properties.shiftProp && !this.properties.lang) {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.ruShift[i];
                }
            });
        } else {
            this.elements.keys.forEach(function (item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.ru[i];
                }
            });
        }

    },

    _toggleSound(type) {

        let audio = document.querySelector(`audio[data-key="${type}"]`);

        if (this.properties.sound) {

            if (!audio) return;
            audio.currentTime = 0;
            audio.play();
        }

    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});

/*const keyLayouts = {
    en: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?","shift",
        "ru", "space", "sound"
    ],

    enShift: [
        "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
        "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
        "done", "z", "x", "c", "v", "b", "n", "m", "<", ">", "/", "shift",
        "en", "space", "sound"
    ],

    ru: [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","shift",
        "ru", "space", "sound"
    ],

    ruShift: [
        "!", "№", ";", "%", ":", "*", "(", ")", "-", "+", "backspace",
        "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
        "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
        "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","shift",
        "ru", "space", "sound"
    ]
};

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        textField: document.getElementById("text-field")
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shiftProp: false,
        lang: true,
        sound: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    this.elements.textField.focus();
                });
            });
        });
    },

    _createKeys() {
        console.log("_createKeys()");
        const fragment = document.createDocumentFragment();

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        let keyLayout;
        if (this.properties.lang) {
            keyLayout = keyLayouts.en;
        } else {
            keyLayout = keyLayouts.ru;
        }

        console.log(this.properties.lang);

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "ъ", "enter", "shift"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = `<b>shift</b>`;

                    keyElement.addEventListener("click", () => {
                        console.log("был нажат shift");
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.shiftProp);
                    });

                    break;

                case "en":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = `<b>en</b>`;

                    keyElement.addEventListener("click", () => {
                        this._toggleLang();
                        keyElement.classList.toggle(this.properties.lang);
                    });

                    break;

                case "ru":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = `<b>ru</b>`;

                    keyElement.addEventListener("click", () => {
                        this._toggleLang();
                        keyElement.classList.toggle(this.properties.lang);
                    });

                    break;

                case "sound":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("volume_up");

                    keyElement.addEventListener("click", () => {
                        console.log("был нажат sound");
                        keyElement.classList.toggle("keyboard__key--active");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },


    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shiftProp = !this.properties.shiftProp;
        console.log("shift " + this.properties.shiftProp);

        if(this.properties.shiftProp) {
            this.elements.keys.forEach(function(item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.enShift[i];
                }
            });
        } else {
            this.elements.keys.forEach(function(item, i, array) {
                if (item.childElementCount === 0) {
                    item.textContent = keyLayouts.en[i];
                }
            });
        }
    },

    _toggleLang() {
        this.properties.lang = !this.properties.lang;
        while (this.elements.keysContainer.children.length > 0) {
            this.elements.keysContainer.children[0].remove();
        }
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});*/