import { useState } from "react";
import { upload, extract } from "../api/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file); // Debugging log

    try {
      const response = await upload(formData);
      setUploadedFile(response.data.filename);

      setMessage(response.data.message || "Upload successful!");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage("Upload failed.");
    }
  };
  
  const handleExtract = async () => {
    if(!uploadedFile){
      setMessage("No uploaded file found.");
      return;
    }

    try{
      const response = await extract({filename: uploadedFile});
      setMessage(`Data extracted successfully: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setMessage("Extraction failed.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Upload XML File</h2>
      <input type="file" accept=".xml" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {uploadedFile && (
        <button
          onClick={handleExtract}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Extract Data
        </button>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}