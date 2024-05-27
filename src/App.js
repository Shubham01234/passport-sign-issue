import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import main from "./ImmutablePassport"

//Frontend use ether version 6.11.1
//Backend use ether version 5.7.0 

//Frontend code.
function App() {
  const [loading, setLoading] = useState(false);
  const getSigner = () => {
    let provider = new ethers.BrowserProvider(main.provider);
    return provider?.getSigner();
  };

  // Using walletConnect to receive the accessToken and pass the wallet address.
  const wallectConnect = async () => {
    const toastId =
      toast.loading("Signing... Please wait..", { theme: "light" });
    try {
      setLoading(true);
      isDevices() && (await delay(2000)); // 2000 milliseconds = 2 seconds
      let signature;
      let walletType;
      let payload;
      if (connector && connector.name === "Immutable Passport") {
        walletType = "ImmutablePassport";
        const signer = await getSigner();
        const domain = {
          name: 'Astra Nova Black Pass',
          version: '1',
          chainId: RPC_LINK?.includes("testnet") ? 13473 : 13371,
          // verifyingContract: CONTRACT_ADDRESS
          verifyingContract: "0xA71edb43CD898Cdd881fd0beB0f47e11d2aD8B9E"
        };
        const types = {
          MyType: [
            { name: 'message', type: 'string' },
          ]
        };
        const message = {
          message: 'I3WjCEHiLEAax0jlGpfCdJCkoxc6bjwWzPKPB0WYlsTlG5fh6PXU5Uu79KFjOF6I',
        };
        payload = {
          domain: domain,
          types: types,
          message: message
        };
        signature = await signer.signTypedData(
          domain, types, message
        );
      } else {
        walletType = "Other";
        isDevices() && (await delay(2000)); // 2000 milliseconds = 2 seconds
        signature = await signMessageAsync({
          message:
            "I3WjCEHiLEAax0jlGpfCdJCkoxc6bjwWzPKPB0WYlsTlG5fh6PXU5Uu79KFjOF6I",
        });
      }
      const response = await WALLET_CONNECT({
        wallet_address: address,
        signature: signature,
        walletType: walletType,
        ...(payload ? {payload: payload} : {}),
      });
      if (response) {
        setStatusCode(response.status);
      }
      if (response?.data) {
        let { accessToken } = response.data;
        setAccessToken(accessToken);
        localStorage.setItem("accessToken", accessToken);
        await getUserDetails();
      }
      setLoading(false);
      setShowCustomWalletModal(false);
    } catch (error) {
      handleError(error);
    } finally {
      toastId && toast.dismiss(toastId);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
