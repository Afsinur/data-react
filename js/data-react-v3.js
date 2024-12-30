let importedFiles = new Set(); // To track imported files and prevent duplicates

async function importHTML() {
  const elements = document.querySelectorAll("[react-import]");
  const importPromises = [];

  elements.forEach((element) => {
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
            // Insert the fetched HTML content into the element
            element.innerHTML = htmlContent;
            importedFiles.add(filePath); // Mark this file as imported
          })
          .catch((error) => {
            console.error("Error loading HTML file:", error);
          })
      );
    }
  });

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

function updateReactElements() {
  const elements = document.querySelectorAll("[react]");

  elements.forEach((element) => {
    const key = element.getAttribute("react");
    try {
      const data = new Function(`return ${key}`)(); // Dynamically evaluate the data key

      if (Array.isArray(data)) {
        const template = element.innerHTML.trim(); // Save the initial HTML template
        const renderedHTML = data
          .map((item) => processTemplate(template, item))
          .join("");
        element.innerHTML = renderedHTML;
      }
    } catch (error) {
      console.error(`Error processing react attribute '${key}':`, error);
    }
  });
}

function processTemplate(template, data) {
  // Replace placeholders with data values or evaluate expressions
  let processedHTML = template.replace(
    /{\s*([^{}]+)\s*}/g, // Match anything inside curly braces
    (_, expression) => {
      try {
        // Safely evaluate the expression in the context of 'data'
        const func = new Function(
          "data",
          `with(data) { return ${expression}; }`
        );
        return func(data) || "";
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
  await importHTML(); // Import external HTML files first
  updateReactElements(); // Then update dynamic elements
});
