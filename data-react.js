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
let globalDom = null;
let globalIncludeDom = null;
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
function map(dt, modifiedStr) {
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
        const evaluatedCondition = safeCondition.replace(
          /\b(\w+)\b/g,
          (key) => {
            return obj.hasOwnProperty(key) ? obj[key] : key;
          }
        );

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

  globalDom.innerHTML = ``;
  dt.forEach((d) => {
    let replacedStr = replacePlaceholders(modifiedStr, d);
    let finalStr = evaluateComplexConditions(d, replacedStr);

    let xDom = stringToDOM(finalStr);

    let ifDom = xDom.querySelector(`[data-if]`);
    let elseDom = xDom.querySelector(`[data-else]`);
    let ifNotDom = xDom.querySelector(`[data-if-not]`);

    ifDom?.dataset[`if`] == "false" && ifDom.remove();
    elseDom?.dataset[`else`] == "true" && elseDom.remove();
    ifNotDom?.dataset[`ifNot`] == "true" && ifNotDom.remove();

    let replacedStrAgain = replacePlaceholders(xDom.outerHTML, d);

    globalDom.innerHTML += replacedStrAgain;
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
  function includedHtmls() {
    let includeHtmlDoms = document.querySelectorAll(
      `[data-${obj.includeHtmlDataset}]`
    );

    if (Array.from(includeHtmlDoms).length > 0) {
      let mapedIncludeHtmls = Array.from(includeHtmlDoms).map((dom, i) => {
        globalIncludeDom = dom;

        let fnStr = dom.dataset[convertToCamelCase(obj.includeHtmlDataset)];
        let newF = new Function("url", includeHtml);

        return { dom, fnStr, newF };
      });

      mapedIncludeHtmls.forEach(async (obj, i) => {
        let htmlStr = await obj.newF(obj.fnStr);
        obj.dom.innerHTML = htmlStr;

        if (i + 1 == mapedIncludeHtmls.length) {
          setTimeout(() => {
            dataMaps();
          });
        }
      });
    } else {
      dataMaps();
    }
  }
  function dataMaps() {
    let dataMapDoms = document.querySelectorAll(`[data-${obj.initDataset}]`);

    dataMapDoms.forEach((dom, i) => {
      globalDom = dom;

      let temp = dom.querySelector(`[data-${obj.templateDataset}]`);

      let tempStr = temp.outerHTML.toString();

      let fnStr = dom.dataset[obj.initDataset];
      let modifiedFnStr = modifyPrintDataString(
        fnStr,
        `${JSON.stringify(tempStr)}`
      );

      let newF = new Function(modifiedFnStr);

      newF();
    });
  }
  includedHtmls();
}

window.addEventListener("DOMContentLoaded", () => loadDataReact(initObj));
