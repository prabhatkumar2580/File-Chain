import React, { useState } from "react";
import axios from "axios";
import { GiCloudUpload } from "react-icons/gi";
import { toast } from "react-toastify";
import { color, motion } from "framer-motion";
function FileUpload({ account, contract, provider }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // File Uploading To Pinata Server
        const resFile = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const percent = Math.floor((loaded * 100) / total);
              setProgress(percent);
            },
            headers: {
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
              "Content-Type": "multipart/form-data",
            }
          }
        );
        // Sent File URL Hash to BlockChain Contract
        const fileHash = `ipfs://${resFile.data.IpfsHash}`;
        contract.add(account, fileHash);
        toast.success("Successfully Image Uploaded !");
        setFileName(null);
        setFileSize(null);
        setProgress(0);
      } catch (error) {
        toast.error("Unable to upload file to Pinata !", error);
      }
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    // console.log(data);
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    setFileSize(e.target.files[0].size/1000000);
    e.preventDefault();
  };
  return (
    <>
      <form
        className="flex flex-col justify-center items-center font-['tomato_grotesk']"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="file-upload"
          className="w-full h-[100px] flex justify-center items-center m-2 rounded-xl bg-zinc-900 z-[99]"
        >
          <input
            disabled={!account}
            className="bg-zinc-700 text-white"
            type="file"
            id="file-upload"
            name="data"
            hidden
            onChange={retrieveFile}
          />
          <div className="p-12 flex justify-center items-center gap-2 border-2 border-dashed rounded-lg w-full h-full border-[#3f3f46]">
            {fileName ? (
              <div className="flex flex-col gap-2 h-12 ">
                <div className="file-details flex gap-2">
                  <span className="text-white opacity-70">{fileName} </span>
                  <span className="text-white opacity-70">|</span>
                  <span className="text-white opacity-70">
                    {parseFloat(fileSize).toFixed(2)}mb
                  </span>
                </div>

                <div className="progress-bg w-full h-[5px] rounded-full bg-zinc-700">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`progress h-full rounded-full bg-[salmon]`}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <GiCloudUpload color="#3f3f46" size={65} />
                <span className="text-white opacity-40">upload file</span>
              </>
            )}
          </div>
        </label>
        <motion.button
          type="submit"
          className={`upload w-full bg-zinc-900 scale-100 text-white py-2 rounded-xl`}
          whileTap={{ scale: `${fileName && '0.95'}` }}
          whileHover={{backgroundColor:  `${fileName ? '#3f3f46' : 'black'}` }}
          disabled={!fileName}
        >
          Upload
        </motion.button>
      </form>
    </>
  );
}

export default FileUpload;
