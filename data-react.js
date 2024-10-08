const initObj = {
  initDataset: "react",
  templateDataset: "map",
  includeHtmlDataset: "include-html",
};
const includeHtml = `
return (async ()=>{
  let finaleUrl = url+'.html';

  let res = await fetch(finaleUrl);
  let txt = await res.text();
  
  return txt;
  })()
  `;
function stringToDOM(htmlString) {
  // Create a temporary container element
  const tempDiv = document.createElement("div");
  // Set the innerHTML of the container to the provided string
  tempDiv.innerHTML = htmlString.trim();
  // Return the first child of the container as the DOM element
  return tempDiv.firstChild;
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function replacePlaceholders(template, replacements) {
  return template.replace(/{(\w+)}/g, (match, key) => {
    if (isBoolean(replacements[key])) {
      return replacements[key];
    } else if (replacements[key] == undefined || replacements[key] == null) {
      return `false`;
    } else {
      return replacements[key] || match;
    }
  });
}
function evaluateComplexConditions(obj, str) {
  // Regular expression to match everything inside { ... }
  const regex = /\{([^}]+)\}/g;

  return str.replace(regex, (match, condition) => {
    try {
      // Escape any potential HTML inside quotes
      const safeCondition = condition.replace(/'/g, "`");

      // Replace keys with values from the object
      const evaluatedCondition = safeCondition.replace(/\b(\w+)\b/g, (key) => {
        return obj.hasOwnProperty(key) ? obj[key] : key;
      });

      // Use "new Function" to evaluate the resulting condition
      const result = new Function(`return ${evaluatedCondition};`)();

      // Return the evaluated result, ensuring HTML is preserved
      return typeof result === "string" ? result.replace(/`/g, "'") : result;
    } catch (e) {
      console.error("Error evaluating condition:", condition, e);
      return "";
    }
  });
}
function modifyPrintDataString(inputString, newText) {
  // Remove the closing parenthesis from the inputString
  let modifiedString = inputString.replace(/\)$/, "");

  // Add ", newData)" at the end
  return modifiedString + `, ${newText})`;
}
function convertToCamelCase(str) {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) {
        // Keep the first word lowercase
        return word.toLowerCase();
      }
      // Capitalize the first letter of the subsequent words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}
function loadDataReact(obj) {
  function includedHtmls(documentDom) {
    let includeHtmlDoms = documentDom.querySelectorAll(
      `[data-${obj.includeHtmlDataset}]`
    );

    if (Array.from(includeHtmlDoms).length > 0) {
      let mapedIncludeHtmls = Array.from(includeHtmlDoms).map((dom, i) => {
        let fnStr = dom.dataset[convertToCamelCase(obj.includeHtmlDataset)];
        let newF = new Function("url", includeHtml);

        return { dom, fnStr, newF };
      });

      mapedIncludeHtmls.forEach(async (ob, i) => {
        let htmlStr = await ob.newF(ob.fnStr);
        ob.dom.innerHTML = htmlStr;
        dataMaps(ob.dom);

        if (htmlStr.includes(`data-${obj.includeHtmlDataset}`)) {
          includedHtmls(ob.dom);
        }
      });
    } else {
      dataMaps(document);
    }
  }
  function dataMaps(documentDom) {
    let dataMapDoms = documentDom.querySelectorAll(`[data-${obj.initDataset}]`);

    dataMapDoms.forEach((dom, i) => {
      let temp = dom.querySelector(`[data-${obj.templateDataset}]`);

      let arrayName = extractMapArgument(dom.dataset[obj.initDataset]);
      new Function(`return ${arrayName}`)().forEach((d, i) => {
        let replacedStr = replacePlaceholders(temp.outerHTML.toString(), d);
        let finalStr = evaluateComplexConditions(d, replacedStr);

        let xDom = stringToDOM(finalStr);

        let ifDom = xDom.querySelector(`[data-if]`);
        let elseDom = xDom.querySelector(`[data-else]`);
        let ifNotDom = xDom.querySelector(`[data-if-not]`);

        ifDom?.dataset[`if`] == "false" && ifDom.remove();
        elseDom?.dataset[`else`] == "true" && elseDom.remove();
        ifNotDom?.dataset[`ifNot`] == "true" && ifNotDom.remove();

        let replacedStrAgain = replacePlaceholders(xDom.outerHTML, d);

        if (i < 1) {
          dom.innerHTML = "";
          dom.innerHTML += replacedStrAgain;
        } else {
          dom.innerHTML += replacedStrAgain;
        }
      });
    });
  }

  includedHtmls(document);
  dataMaps(document);
}
function extractMapArgument(str) {
  // Regular expression to find `map(someArgument)`
  const regex = /map\(([^)]+)\)/;

  // Execute the regular expression on the input string
  const match = str.match(regex);

  // If a match is found, return the argument (first capture group)
  if (match) {
    return match[1].trim();
  } else {
    return null; // If no match is found, return null
  }
}

window.addEventListener("DOMContentLoaded", () => loadDataReact(initObj));
