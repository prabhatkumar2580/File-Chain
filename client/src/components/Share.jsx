import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Share({ contract }) {
  const [address, setAddress] = useState("");
  const [banAddress, setBanAddress] = useState("")
  const [accessList, setAccessList] = useState([])
  const handleShare = async () => {
    await contract.allow(address);
    toast.success("Shared with " + address);
  };

  const handleBan = async () => {
    await contract.disallow(banAddress);
    toast.success("Banned :" + banAddress);
  };

  useEffect(() => {
    const handleAccessList = async () => {
      const accessList = await contract.shareAccess();
      setAccessList(accessList);
      console.log(accessList);
    }
    contract && handleAccessList();
  }, [])

  
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 font-[tomato_grotesk] mt-3 bg-zinc-600 p-6 rounded-tr-xl rounded-tl-xl">
        <div className="">
          <input
            type="text"
            value={address}
            placeholder="enter address"
            onChange={(e) => setAddress(e.target.value)}
            className="py-2 px-4 rounded-tl-lg rounded-bl-lg"
          />
          <button
            onClick={() => handleShare()}
            className="bg-zinc-700 text-zinc-400 py-2 px-4 rounded-tr-lg rounded-br-lg"
          >
            share
          </button>
        </div>
        <form action="" id="myForm">
          <select className="p-2 text-[12px] rounded-md" id="selectAddress">
            <option value="Shared WIth">shared with address</option>
            {accessList.map((item, i) => (
              <option key={i} value={item.user}>
                {item.user}
              </option>
            ))}
          </select>
        </form>
      </div>

      <div className="flex justify-center items-center gap-4 font-[tomato_grotesk] mt-3 bg-zinc-600 p-6 rounded-br-xl rounded-bl-xl">
          <input 
          onChange={(e)=>setBanAddress(e.target.value)}
          value={banAddress}
          type="text" placeholder="enter address" className=" rounded-xl text-sm py-2 px-4 z-[99]"/>
          <button onClick={()=>handleBan()} className="py-2 px-4 bg-red-400 z-[99] text-white rounded-xl">ban</button>
      </div>
    </>
  );
}

export default Share;
