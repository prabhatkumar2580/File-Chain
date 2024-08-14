import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiFillDelete } from "react-icons/ai";
import { IoIosDownload } from "react-icons/io";
function Display({ account, contract }) {
  const [otherAddress, setOtherAddress] = useState("");
  const [hashes, setHashes] = useState([]);
  const [fileInfo, setFileInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deleteHash, setDeleteHash] = useState("");

  const getData = async () => {
    let dataArray;
    try {
      if (otherAddress) {
        dataArray = await contract.display(otherAddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
        // console.log(dataArray);
      }
    } catch (error) {
      toast.error("You don't have access !")
    }

    const isEmpty = Object.keys(dataArray).length === 0;
    if (!isEmpty) {
      const str = await dataArray.toString();
      const strArr = str.split(",");
      const newArr = strArr.map((item) => item.substr(7));
      setHashes(newArr);
      console.log(newArr);
    } else {
      toast.error("No File to Display !");
    }

    await retrieveData();

    handleFilter();
  };

  const retrieveData = async () => {
    try {
      const response = await axios.get(
        `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=100`,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          },
        }
      );
      console.log(response.data.rows);
      setFileInfo(response.data.rows);
      // console.log(fileInfo);
      toast.success("Data Fetched, It's show time !");
    } catch (error) {
      toast.error("error in fetching");
      console.log(error);
    }
  };

  const handleFilter = () => {
    const filtered = fileInfo.filter((item) => {
      return hashes.includes(item.ipfs_pin_hash);
    });
    // const uniqueFiltered = filtered.slice(0, Math.ceil(filtered.length / 2));
    setFilteredData(filtered);
    console.log(filtered);
  };

  const deleteFile = async (deleteHash) => {
    try {
      const response = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${deleteHash}`,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
          },
        }
      );

      if (response.status === 200) {
        // setDeleteStatus("File deleted successfully", response.status);
        toast.success("File deleted successfully", response.status);

        const updatedData = filteredData.filter(
          (item) => item.ipfs_pin_hash !== deleteHash
        );
        setFilteredData(updatedData);
        console.log(updatedData);
      } else {
        // setDeleteStatus("Unable to delete file", response.status);
        toast.error("Unable to delete file", response.status);
      }
    } catch (error) {
      toast.error("Error in deleting file", error.message);
      // setDeleteStatus("Error in deleting file");
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex w-full gap-2 mt-2">
          <input
            onChange={(e) => setOtherAddress(e.target.value)}
            value={otherAddress}
            type="text"
            placeholder="enter address"
            className="address px-4 flex-grow py-2 bg-[#18181b] shadow-[0px_1px_4px_rgba(0, 0, 0, 0.16)] rounded-xl text-zinc-500 outline-none"
          />
          <button
            onClick={() => getData()}
            className="text-zinc-400 bg-zinc-600 px-4 py-2 rounded-xl"
          >
            Get Data
          </button>
          <div className="text-white">
            <button
              disabled={!hashes.length}
              className="text-zinc-400 bg-zinc-600 px-4 py-2 rounded-xl"
              onClick={handleFilter}
            >
              Show Data
            </button>
          </div>
        </div>

        <div className="w-full">
          {filteredData.map((item, i) => (
            <div
              key={i}
              className="bg-zinc-700 flex justify-between items-center text-zinc-400 mt-2 px-4 py-2 rounded-xl border-dashed border-[1px] border-zinc-600"
            >
              <div>
                <h1 className="text-zinc-300">{item.metadata.name}</h1>
                <span className="flex gap-2 opacity-60">
                  <p>{item.mime_type}</p>
                  <p>{(item.size / 1000).toFixed(2)}kb</p>
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => deleteFile(item.ipfs_pin_hash)}
                  className="delete"
                >
                  <AiFillDelete />
                </button>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`}
                  target="_blank"
                  className="download"
                >
                  <IoIosDownload />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Display;
