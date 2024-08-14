import "./App.css";
import Upload from "../../artifacts/contracts/Upload.sol/Upload.json";
// import Upload from ".../artifacts/contracts/Upload.sol/Upload.json"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Display from "./components/Display";
import { IoMdDownload } from "react-icons/io";
import { MdFileUpload } from "react-icons/md";
import { IoShareSocial } from "react-icons/io5";
import { motion } from "framer-motion";
import Share from "./components/Share";
function App() {

  const [buttons, setButtons] = useState([
    {
      id:0,
      name: "get",
      icon: <IoMdDownload />,
      isOpen:true
    },
    {
      id:1,
      name: "upload",
      icon: <MdFileUpload />,
      isOpen:false
    },
    {
      id:2,
      name: "share",
      icon: <IoShareSocial />,
      isOpen:false
    },
  ]);

  

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed !");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <>
      <div className='relative w-full min-h-screen font-["tomato_grotesk"] p-4 bg-zinc-800'>
        <div className="max-w-[900px] mx-auto">
          <div className="banner text-zinc-600  font-bold text-[8vmax] fixed top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] opacity-40 pointer-events-none">
            filechain
          </div>
          <div className="w-full flex justify-between items-center text-zinc-400 bg-[#18181b] border border-zinc-600 border-dashed px-6 py-2 rounded-lg font-bold">
            <h1 className="sm:text-[8px]">
              Account : {account ? account : "Not Connected To Meta Mask"}
            </h1>
            <div className="flex gap-2">
              {buttons.map((item, i) => (
                <motion.button
                  key={i}
                  disabled={item.isOpen}
                  onClick={() => {
                    setButtons((prevItems) =>
                      prevItems.map((item) =>
                        item.id === i
                          ? { ...item, isOpen: !item.isOpen }
                          : { ...item, isOpen: false }
                      )
                    );
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center items-center hover:gap-2 gap-1 duration-150 px-2 py-1 bg-zinc-600 rounded-md"
                >
                  <p>{item.name}</p>
                  <span>{item.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>
          {buttons[1].isOpen && (
            <FileUpload
              account={account}
              contract={contract}
              provider={provider}
            />
          )}
          {buttons[0].isOpen && (
            <Display account={account} contract={contract} />
          )}

          {buttons[2].isOpen && <Share contract={contract} />}
        </div>
      </div>
      <ToastContainer position="bottom-left" />
    </>
  );
}

export default App;
