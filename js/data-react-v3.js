let importedFiles = new Set(); // To track imported files and prevent duplicates

async function importHTML() {
  const elements = document.querySelectorAll("[react-import]");
  const importPromises = [];

  function importify(element) {
    const filePath = element.getAttribute("react-import");

    if (!importedFiles.has(filePath)) {
      // Prevent fetching the same file
      importPromises.push(
        fetch(filePath + ".html")
          .then((response) => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error(`Failed to load file: ${filePath}.html`);
            }
          })
          .then((htmlContent) => {
            try {
              // Insert the fetched HTML content into the element

              let tempData = JSON.parse(
                element.attributes.data.value.replace(/'/g, '"')
              );

              // Create a temporary element to handle nested structures
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = htmlContent;

              const renderedHTML = tempData
                .map((item) =>
                  processTemplate(tempDiv.children[0].innerHTML, item)
                )
                .join("");

              tempDiv.children[0].innerHTML = renderedHTML;

              element.innerHTML = tempDiv.children[0].outerHTML;
              importedFiles.add(filePath); // Mark this file as imported
            } catch (error) {
              if (error.message.includes("is not valid JSON")) {
                // Insert the fetched HTML content into the element
                console.log(htmlContent);

                element.innerHTML = htmlContent;
                importedFiles.add(filePath); // Mark this file as imported

                return element;
              }
            }
          })
          .then(async (el) => {
            await importHTML();

            console.log(el && el);

            console.log(el && updateReactElements(el, "again"));
          })
          .catch((error) => {
            console.error("Error loading HTML file:", error);
          })
      );
    }
  }

  elements.forEach(importify);

  // Wait for all imports to finish before continuing
  await Promise.all(importPromises);

  // After all imports, recursively process nested `react-import` elements
  // in newly inserted HTML content.
  await processNestedImports();
}

async function processNestedImports() {
  const nestedImports = document.querySelectorAll("[react-import]");

  for (let element of nestedImports) {
    const filePath = element.getAttribute("react-import");
    if (!importedFiles.has(filePath)) {
      await fetch(filePath + ".html")
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error(`Failed to load file: ${filePath}.html`);
          }
        })
        .then((htmlContent) => {
          element.innerHTML = htmlContent;
          importedFiles.add(filePath);
        })
        .catch((error) => {
          console.error("Error loading HTML file:", error);
        });
    }
  }
}

function updateReactElements(element, again) {
  const elements = document.querySelectorAll("[react]");

  function reactify(element) {
    const key = element.getAttribute("react");

    try {
      const data = new Function(`return ${key}`)(); // Dynamically evaluate the data key

      if (Array.isArray(data)) {
        const template = element.innerHTML.trim(); // Save the initial HTML template
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = template;

        const renderedHTML = data
          .map((item) =>
            processTemplate(
              again
                ? tempDiv.children[0].innerHTML
                : tempDiv.children[0].outerHTML,
              item
            )
          )
          .join("");

        if (again) {
          tempDiv.children[0].innerHTML = renderedHTML;
          element.innerHTML = tempDiv.children[0].outerHTML;
        } else {
          tempDiv.innerHTML = renderedHTML;
          element.innerHTML = tempDiv.innerHTML;
        }
      } else {
        throw Error(data);
      }
    } catch (error) {
      console.log(error.message);

      if (error.message) {
        const closestEl = element.closest(`[data]`);

        element.setAttribute("react", closestEl.attributes[`data`]?.value);

        updateReactElements(element, "again");
      }

      console.error(`Error processing react attribute '${key}':`, error);
    }
  }

  if (element) {
    reactify(element);
  } else {
    elements.forEach(reactify);
  }
}

function processTemplate(template, data) {
  // Replace placeholders with data values or evaluate expressions
  let processedHTML = template.replace(
    /{\s*([^{}]+)\s*}/g, // Match anything inside curly braces
    (_, expression) => {
      //console.log(expression, data);

      try {
        // Safely evaluate the expression in the context of 'data'
        const func = new Function(
          "data",
          `with(data) {            
            return ${expression}; 
          }`
        );

        return typeof func(data) == "object"
          ? JSON.stringify(func(data)).replace(/"/g, "'")
          : func(data) || "";
      } catch (error) {
        console.error(`Error evaluating expression: ${expression}`, error);
        return `{ ${expression} }`; // Leave the expression unchanged if there's an error
      }
    }
  );

  // Create a temporary element to handle nested structures
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = processedHTML;

  const nestedElements = tempDiv.querySelectorAll("[react]");
  nestedElements.forEach((nestedElement) => {
    const nestedKey = nestedElement.getAttribute("react");
    const nestedData = getNestedValue(data, nestedKey);

    if (Array.isArray(nestedData)) {
      const nestedTemplate = nestedElement.innerHTML.trim();
      const nestedHTML = nestedData
        .map((nestedItem) => processTemplate(nestedTemplate, nestedItem))
        .join("");
      nestedElement.innerHTML = nestedHTML;
    }
  });

  return tempDiv.innerHTML; // Return the updated HTML
}

// Helper function to get nested values
function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

// Call the function to process the data
window.addEventListener("DOMContentLoaded", async () => {
  updateReactElements(); // Then update dynamic elements
  await importHTML(); // Import external HTML files first
});
