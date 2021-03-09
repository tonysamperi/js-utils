(function () {
    const prepare = function (expression, value) {
        const row = document.createElement("h3");
        row.innerHTML = expression + " = " + value;
        const wrapper = document.querySelector("[hju-wrapper]");
        wrapper.append(row);
    };

    const seeConsole = function () {
        return "(See console 😁)"
    };
    const fns = [
        {
            expression: "hybridJsUtils.htmlCountDown(5000, 25, document.querySelector(\"#counter\"))",
            customPrepare: function () {
                const row = document.createElement("h3");
                const wrapper = document.querySelector("[hju-wrapper]");
                wrapper.append(row);
                const span = document.createElement("span");
                span.id = "counter";
                const value = document.createElement("span");
                value.setAttribute("hju-expression", "");
                row.append(value);
                row.append(span);
            }
        },
        {
            expression: "hybridJsUtils.isNumeric(\"foo\")",
            print: function (v) {
                return v ? "YES" : "NO";
            }
        },
        {
            expression: "hybridJsUtils.loadJQuery()",
            print: seeConsole
        },
        {
            expression: "hybridJsUtils.logWithStyle(\"Test\", \"My msg\", \"color: #CC0000; font-weight: bold\")",
            print: seeConsole
        },
        {
            expression: "hybridJsUtils.randomHex(5)"
        },
        {
            expression: "hybridJsUtils.randomInt(1, 10)"
        },
        {
            expression: "hybridJsUtils.removeTrailingSlash(\"http://www.example.com/\")"
        },
        {
            expression: "hybridJsUtils.roundNumber(2500, 1000)"
        },
    ];

    fns.forEach(function (item) {
        const expressionValue = eval(item.expression);
        const value = item.print ? item.print(expressionValue) : expressionValue;
        if (item.customPrepare) {
            item.customPrepare(item.expression, value);
        }
        else {
            prepare(item.expression, value);
        }
    })
})();
