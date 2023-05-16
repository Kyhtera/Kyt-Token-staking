import logo from './logo.svg';
import './App.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import "./styles/home.css";
import { useState } from 'react';


const stakingAddress = "0x6472676A30ff943786942eC3D067459d2540287C";
const kytheraTokenAddress = "0x20CF63fCfC7460c8457B77d8aD29De341ed27A51"

function App() {

  const { contract } = useContract(stakingAddress);
  const { contract: kytheraToken, isLoading: isLoadingStakingToken } = useContract("0x20CF63fCfC7460c8457B77d8aD29De341ed27A51")

  //console.log(stakingToken);

  const address = useAddress();
  const { data, isLoading } = useContractRead(contract, "getStakeInfo", [address])

  const [amountToStake, setAmountToStake] = useState(0);

  return (
    <>
      <div className="container">
        <main className="main">
          <h1 className="title">Welcome to KyT Token staking app!</h1>

          <p className="description">
            Stake certain amount and get reward tokens back!
          </p>


          <div className="connect">
            <ConnectWallet />
          </div>
          <div className='stakeContainer'>
            <input className='textbox' type="number"
              value={amountToStake}
              onChange={(e) => setAmountToStake(e.target.value)} />
            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {

                await kytheraToken.setAllowence(stakingAddress, amountToStake);
                await contract.call("stake", [ethers.utils.parseEther(amountToStake)])
              }}
              theme="dark"
            >
              Stake
            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {

                await contract.call("withdraw", [ethers.utils.parseEther(amountToStake)])

              }}
              theme="dark">

              Unstake

            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) => {

                await contract.call("claimRewards")

              }}
              theme="dark">

              Claim Rewards

            </Web3Button>


          </div>

          <div className="grid">
            <a className="card">
              Staked: {data?._tokensStaked && ethers.utils.formatEther(data?._tokensStaked)} UT <br></br>
            </a>
            <a className="card">
              Rewards: {data?._rewards && Number(ethers.utils.formatEther(data?._rewards)).toFixed(2)} MET
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;