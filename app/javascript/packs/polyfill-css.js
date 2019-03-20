cssPolyfill();
function cssPolyfill() {
    if (isPolyFillTarget()) {
        let links = document.getElementsByTagName("link");
        for (let index = 0; index < links.length; index++) {
            let url = links[index].getAttribute("href");
            if (!url.includes("http://0.0.0.0:8080")) {
                setCSS(url, index);
            }
        }
    }
}
function setCSS(url, index) {
    let links = document.getElementsByTagName("link");
    getHelper(url)
        .then(function(res) {
            if (res.ok) {
                return res.text();
            } else {
                return "";
            }
        })
        .then(function(res) {
            if (res.length > 0) {
                data = getPolyfilledCSS(res);
                file = buildBlob(data, "text/css");
                if (file != null) {
                    url = window.URL.createObjectURL(file);
                    copy = links[index];
                    copy.setAttribute("href", url);
                    document.getElementsByTagName("head")[0].appendChild(copy);
                }
            }
        });
}
function buildBlob(data, type) {
    var file;
    try {
        file = new Blob([data], { type: type });
    } catch (e) {
        window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name == "TypeError" && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data);
            file = bb.getBlob(type);
        } else if (e.name == "InvalidStateError") {
            file = new Blob([data], { type: type });
        } else {
            console.log("No Blob building supported.");
        }
    }
    return file;
}
function getPolyfilledCSS(data) {
    lines = data.split(/[\r\n]/);
    variables = getAllVariables(lines);
    css = [];
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        if (containsVariable(line)) {
            css.push(getReplacedLine(line, variables));
        } else {
            css.push(line);
        }
    }
    return css.join("\n");
}
function containsVariable(line) {
    return line.includes("var(--");
}
function getReplacedLine(line, variables) {
    let keys = getJsonKeys(variables);
    let replacedLine = line;
    keys.forEach(function(key) {
        replacedLine = replacedLine.replace("var(" + key + ")", variables[key]);
    });
    return replacedLine;
}
function getJsonKeys(json) {
    keys = [];
    for (let k in json) keys.push(k);
    return keys;
}
function getAllVariables(lines) {
    variables = {};
    for (let i = 0; i < lines.length; i++) {
        line = lines[i].trim();
        value = getVariable(line);
        if (value["found"]) {
            variables[value["name"]] = value["value"];
        }
    }
    keys = getJsonKeys(variables);
    index = 0;
    while (index < keys.length) {
        curr = variables[keys[index]];
        if (containsVariable(curr)) {
            variables[keys[index]] = getReplacedLine(curr, variables);
        } else {
            index += 1;
        }
    }
    return variables;
}
function getVariable(line) {
    if (line.length > 3) {
        if (line.substring(0, 2) == "--") {
            parts = line.split(":");
            if (parts.length == 2) {
                return {
                    found: true,
                    name: parts[0].trim(),
                    value: parts[1].replace(";", "").trim()
                };
            }
        }
    }
    return { found: false };
}
function getHelper(url) {
    return fetch(url, {
        headers: {
            Accept: "charset=utf-8"
        },
        method: "GET"
    });
}
function isPolyFillTarget() {
    let browser = getBrowser();
    return browser.includes("IE") || browser.includes("Safari");
}
function getBrowser() {
    var ua = navigator.userAgent,
        tem,
        M =
            ua.match(
                /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
            ) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
            return tem
                .slice(1)
                .join(" ")
                .replace("OPR", "Opera");
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(" ");
}
