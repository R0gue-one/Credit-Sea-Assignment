const validateXMLFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const xmlContent = event.target.result;
        
        try {
          // Try parsing the XML content
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
          
          // Check for parsing errors
          const parserError = xmlDoc.getElementsByTagName("parsererror");
          if (parserError.length > 0) {
            const errorMsg = parserError[0].textContent;
            reject({
              isValid: false,
              error: `XML Parsing Error: ${errorMsg}`,
              details: extractErrorDetails(errorMsg)
            });
            return;
          }
  
          // Basic structure validation
          const validation = {
            isValid: true,
            warnings: [],
            info: {
              rootElement: xmlDoc.documentElement.nodeName,
              childNodes: xmlDoc.documentElement.childNodes.length,
              size: new Blob([xmlContent]).size
            }
          };
  
          // Check for common issues
          if (xmlContent.includes('encoding="') && !xmlContent.includes('<?xml')) {
            validation.warnings.push("XML declaration missing but encoding specified");
          }
          
          if (xmlContent.includes("]]>") && !xmlContent.includes("<![CDATA[")) {
            validation.warnings.push("Found CDATA end marker without start marker");
          }
  
          resolve(validation);
          
        } catch (error) {
          reject({
            isValid: false,
            error: `Validation Error: ${error.message}`,
            details: error
          });
        }
      };
  
      reader.onerror = () => {
        reject({
          isValid: false,
          error: "Failed to read file",
          details: reader.error
        });
      };
  
      reader.readAsText(file);
    });
  };
  
  // Helper function to extract line and column numbers from error messages
  const extractErrorDetails = (errorMsg) => {
    const lineMatch = errorMsg.match(/Line Number (\d+)/i);
    const columnMatch = errorMsg.match(/Column (\d+)/i);
    
    return {
      line: lineMatch ? parseInt(lineMatch[1]) : null,
      column: columnMatch ? parseInt(columnMatch[1]) : null,
      fullMessage: errorMsg
    };
  };
  
  export { validateXMLFile };