import { useState } from "react";
import { upload, extract } from "../api/api";
import { UploadCloud, FileText, Check, AlertCircle, FileJson } from "lucide-react";
import { validateXMLFile } from "./validateXML";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getBackgroundClass = () => {
    if (message.includes("failed")) {
      return "bg-gradient-to-br from-rose-50 to-rose-100";
    }
    if (uploadedFile) {
      return "bg-gradient-to-br from-teal-50 to-teal-100";
    }
    return "bg-gradient-to-br from-slate-100 to-slate-300";
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        const validation = await validateXMLFile(selectedFile);
        
        if (validation.isValid) {
          setFile(selectedFile);
          setMessage("");
          
          // Show warnings if any
          if (validation.warnings.length > 0) {
            setMessage(`File accepted with warnings: ${validation.warnings.join(", ")}`);
          }
        }
      } catch (error) {
        setMessage(`Invalid XML file: ${error.error}`);
        setFile(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/xml") {
      setFile(droppedFile);
      setMessage("");
    } else {
      setMessage("Please upload an XML file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await upload(formData);
      setUploadedFile(response.data.filename); // This is correct
      setMessage("Upload successful!");
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      setUploadedFile(""); // Clear uploadedFile on error
    } finally {
      setIsLoading(false);
    }
};

const handleExtract = async () => {
    if (!uploadedFile) {
      setMessage("No uploaded file found.");
      return;
    }
    setIsLoading(true);
    try {
      await extract({ filename: uploadedFile });
      setMessage("Data extracted successfully!");
      
      // Don't clear uploadedFile immediately
      setTimeout(() => {
        setFile(null);
        setUploadedFile("");
        setMessage("");
      }, 2000); // Clear after 2 seconds

    } catch (error) {
      if (error.response && error.response.status === 409) {
        const confirmed = window.confirm(
          "A profile with this PAN already exists. Do you want to replace it?"
        );
        
        if (confirmed) {
          try {
            await extract({ 
              filename: uploadedFile, 
              forceUpdate: true 
            });
            setMessage("Data extracted successfully!");
            setTimeout(() => {
              setFile(null);
              setUploadedFile("");
              setMessage("");
            }, 2000);
          } catch (updateError) {
            setMessage("Extraction failed. Please try again.");
            setUploadedFile("");
          }
        }
      } else {
        setMessage("Extraction failed. Please try again.");
        setUploadedFile("");
      }
    } finally {
      setIsLoading(false);
    }
};

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${getBackgroundClass()}`}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          XML File Upload
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${file ? "bg-green-50 border-green-300" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            {file ? (
              <>
                <FileText className="w-12 h-12 text-green-500" />
                <p className="text-sm text-gray-600">{file.name}</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500">
                  Drag and drop your XML file here or
                </p>
              </>
            )}
            
            <input
              type="file"
              accept=".xml"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 hover:text-blue-600 font-medium"
            >
              Browse files
            </label>
          </div>
        </div>

        {!uploadedFile ? (
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2
              ${
                file
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                Upload
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FileJson className="w-5 h-5" />
                Extract Data
              </>
            )}
          </button>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm
            ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {message.includes("success") ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}