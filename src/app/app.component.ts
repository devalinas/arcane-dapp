import { ChangeDetectionStrategy, Component, OnInit, HostListener } from '@angular/core';
import Web3 from "web3";
import Web3Modal from 'web3modal';
import { 
  AucDialogService, 
  AucSort, 
  AucTableHeaderItem, 
  AucTableRow, 
  AucTransferModalComponent, 
  AucTransferModalData, 
  AUC_SORT_DIRECTION 
} from '@applicature/components';

const VESTING_TYPE = {
  SWAP: 0,
  LINEAR_VESTING: 1,
  INTERVAL_VESTING: 2
};

let poolAddressOpenSale = '0x6fA41d1c24c8eb762eB8F4df4e8949BC31559D91';
let poolAddressSimpleSwap = '0xe1920E54D430ec82d56885A543C859d2b18Bcb5A';
let poolAddressHarvest = "0xA1cEdeacDa1466c0A96052BEB613b2C4a3BFE747";
let poolAddressIncomingSale = "0xCDBfe2c2E5eCbD6A2b6e7Ec0B2E3B80d33521516";
let arcaneTokenAddress = "0x31c43c8Adee697c9608FF77dE8fd408B6Ec52945";
let ltcTokenAddress = '0x97FAAB5525E9Ea166d227bd7d7d6F1893145208d';
let uahTokenAddress = '0x6582B7C8176A114bE6fEDb269d13C034627696c0';
let stakingAddress = '0x1a96676d50591c570B1bC6A897CD778FB6366155';
let admin = "0x9b38DE554AC02af25c911e262690550c8584BFaa";

declare const window: any;

const TokenABI = [{
  "inputs": [{
          "internalType": "string",
          "name": "name",
          "type": "string"
      },
      {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
      }
  ],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
      },
      {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
      },
      {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
      }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
      },
      {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
      },
      {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
      }
  ],
  "name": "Transfer",
  "type": "event"
},
{
  "inputs": [{
          "internalType": "address",
          "name": "owner",
          "type": "address"
      },
      {
          "internalType": "address",
          "name": "spender",
          "type": "address"
      }
  ],
  "name": "allowance",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [{
          "internalType": "address",
          "name": "spender",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
      }
  ],
  "name": "approve",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "account",
      "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "decimals",
  "outputs": [{
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [{
          "internalType": "address",
          "name": "spender",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
      }
  ],
  "name": "decreaseAllowance",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address",
          "name": "spender",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
      }
  ],
  "name": "increaseAllowance",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "name",
  "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "symbol",
  "outputs": [{
      "internalType": "string",
      "name": "",
      "type": "string"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [{
          "internalType": "address",
          "name": "to",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
      }
  ],
  "name": "transfer",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address",
          "name": "from",
          "type": "address"
      },
      {
          "internalType": "address",
          "name": "to",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
      }
  ],
  "name": "transferFrom",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address",
          "name": "_to",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
      }
  ],
  "name": "mintArbitrary",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
];

const PoolABI = [{
  "inputs": [{
          "internalType": "string",
          "name": "name_",
          "type": "string"
      },
      {
          "internalType": "address",
          "name": "rewardToken_",
          "type": "address"
      },
      {
          "internalType": "address",
          "name": "depositToken_",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "initialUnlockPercentage_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "minAllocation_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "maxAllocation_",
          "type": "uint256"
      },
      {
          "internalType": "enum IPool.VestingType",
          "name": "vestingType_",
          "type": "uint8"
      }
  ],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
      },
      {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
      }
  ],
  "name": "Deposit",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address[]",
          "name": "senders",
          "type": "address[]"
      },
      {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
      }
  ],
  "name": "Deposits",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
      },
      {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
      }
  ],
  "name": "Harvest",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
  }],
  "name": "IncreaseTotalSupply",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
      },
      {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
      }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": false,
          "internalType": "address[]",
          "name": "users",
          "type": "address[]"
      },
      {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "allocation",
          "type": "uint256[]"
      }
  ],
  "name": "SetSpecificAllocation",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [{
          "indexed": false,
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
      },
      {
          "indexed": false,
          "internalType": "uint256",
          "name": "endDate",
          "type": "uint256"
      }
  ],
  "name": "SetTimePoint",
  "type": "event"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
  }],
  "name": "deposited",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "isCompleted",
  "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "rewardTokenDecimals",
  "outputs": [{
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
  }],
  "name": "rewardsPaid",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
  }],
  "name": "specificAllocation",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
  }],
  "name": "specificVesting",
  "outputs": [{
          "internalType": "uint256",
          "name": "periodDuration",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "countPeriodOfVesting",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "cliffDuration",
          "type": "uint256"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "stakedTokenDecimals",
  "outputs": [{
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
  }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "uint256",
          "name": "tokenPrice_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "totalSupply_",
          "type": "uint256"
      }
  ],
  "name": "initializeToken",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "uint256",
      "name": "amount_",
      "type": "uint256"
  }],
  "name": "increaseTotalSupply",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "uint256",
          "name": "startDate_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "endDate_",
          "type": "uint256"
      }
  ],
  "name": "setTimePoint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address[]",
          "name": "addrs_",
          "type": "address[]"
      },
      {
          "internalType": "uint256[]",
          "name": "amount_",
          "type": "uint256[]"
      }
  ],
  "name": "setSpecificAllocation",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "uint256",
          "name": "periodDuration_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "countPeriodOfVesting_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "cliffDuration_",
          "type": "uint256"
      },
      {
          "components": [{
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "percentage",
                  "type": "uint256"
              }
          ],
          "internalType": "struct IPool.Interval[]",
          "name": "intervals_",
          "type": "tuple[]"
      }
  ],
  "name": "setVesting",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address",
          "name": "addr_",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "periodDuration_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "countPeriodOfVesting_",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "cliffDuration_",
          "type": "uint256"
      },
      {
          "components": [{
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "percentage",
                  "type": "uint256"
              }
          ],
          "internalType": "struct IPool.Interval[]",
          "name": "intervals_",
          "type": "tuple[]"
      }
  ],
  "name": "setSpecificVesting",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
          "internalType": "address[]",
          "name": "addrArr_",
          "type": "address[]"
      },
      {
          "internalType": "uint256[]",
          "name": "amountArr_",
          "type": "uint256[]"
      }
  ],
  "name": "addDepositAmount",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "completeVesting",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "uint256",
      "name": "amount_",
      "type": "uint256"
  }],
  "name": "deposit",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "_addr",
      "type": "address"
  }],
  "name": "harvestFor",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "harvest",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "uint256",
      "name": "intervalIndex",
      "type": "uint256"
  }],
  "name": "harvestInterval",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "addr_",
      "type": "address"
  }],
  "name": "getAvailAmountToDeposit",
  "outputs": [{
          "internalType": "uint256",
          "name": "minAvailAllocation",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "maxAvailAllocation",
          "type": "uint256"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getInfo",
  "outputs": [{
          "internalType": "string",
          "name": "name",
          "type": "string"
      },
      {
          "internalType": "address",
          "name": "stakedToken",
          "type": "address"
      },
      {
          "internalType": "address",
          "name": "rewardToken",
          "type": "address"
      },
      {
          "internalType": "uint256",
          "name": "minAllocation",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "maxAllocation",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "totalDeposited",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "tokenPrice",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "initialUnlockPercentage",
          "type": "uint256"
      },
      {
          "internalType": "enum IPool.VestingType",
          "name": "vestingType",
          "type": "uint8"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getTimePoint",
  "outputs": [{
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "endDate",
          "type": "uint256"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getVestingInfo",
  "outputs": [{
          "internalType": "uint256",
          "name": "periodDuration",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "countPeriodOfVesting",
          "type": "uint256"
      },
      {
          "components": [{
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "percentage",
                  "type": "uint256"
              }
          ],
          "internalType": "struct IPool.Interval[]",
          "name": "intervals",
          "type": "tuple[]"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "address",
      "name": "addr_",
      "type": "address"
  }],
  "name": "getBalanceInfo",
  "outputs": [{
          "internalType": "uint256",
          "name": "lockedBalance",
          "type": "uint256"
      },
      {
          "internalType": "uint256",
          "name": "unlockedBalance",
          "type": "uint256"
      }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "uint256",
      "name": "amount_",
      "type": "uint256"
  }],
  "name": "convertToToken",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{
      "internalType": "uint256",
      "name": "amount_",
      "type": "uint256"
  }],
  "name": "convertToCurrency",
  "outputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}
];

const ArcaneTokenABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "name": "AddLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "router",
        "type": "address"
      }
    ],
    "name": "ChangeRouter",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rTotal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tFeeTotal",
        "type": "uint256"
      }
    ],
    "name": "Deliver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isExcludedFromFee",
        "type": "bool"
      }
    ],
    "name": "ExcludeFromFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwned",
        "type": "uint256"
      }
    ],
    "name": "ExcludeFromReward",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isExcludedFromFee",
        "type": "bool"
      }
    ],
    "name": "IncludeInFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwned",
        "type": "uint256"
      }
    ],
    "name": "IncludeInReward",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxTxAmount",
        "type": "uint256"
      }
    ],
    "name": "MaxTxPercent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rTotal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tFeeTotal",
        "type": "uint256"
      }
    ],
    "name": "ReflectFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "previousSwapFee",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "previousTransferFee",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "swapFee",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "transferFee",
        "type": "tuple"
      }
    ],
    "name": "RemoveAllFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "swapFee",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "_liquidityFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_taxFee",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct ArcaneToken.FeeValues",
        "name": "transferFee",
        "type": "tuple"
      }
    ],
    "name": "RestoreAllFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensSwapped",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ethReceived",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensIntoLiquidity",
        "type": "uint256"
      }
    ],
    "name": "SwapAndLiquify",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "SwapAndLiquifyEnabledUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidityFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "taxFee",
        "type": "uint256"
      }
    ],
    "name": "SwapFeePercents",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwned",
        "type": "uint256"
      }
    ],
    "name": "TakeLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "threshold",
        "type": "uint256"
      }
    ],
    "name": "Threshold",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "liquidityFee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "taxFee",
        "type": "uint256"
      }
    ],
    "name": "TranferFeePercents",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwnedSender",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedSender",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedRecipient",
        "type": "uint256"
      }
    ],
    "name": "TransferFromExcluded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwned",
        "type": "uint256"
      }
    ],
    "name": "TransferFromSender",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedSender",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedRecipient",
        "type": "uint256"
      }
    ],
    "name": "TransferStandard",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedSender",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwnedRecipient",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwnedRecipient",
        "type": "uint256"
      }
    ],
    "name": "TransferToExcluded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tOwned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rOwned",
        "type": "uint256"
      }
    ],
    "name": "TransferToRecipient",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawAlienToken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawLeftovers",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxTxAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapAndLiquifyEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "swapFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_liquidityFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_taxFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transferFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_liquidityFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_taxFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2Pair",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2Router",
    "outputs": [
      {
        "internalType": "contract IUniswapV2Router02",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_router",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "threshold",
        "type": "uint256"
      }
    ],
    "name": "setThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeInReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "liquidityFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "taxFee",
        "type": "uint256"
      }
    ],
    "name": "setSwapFeePercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "liquidityFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "taxFee",
        "type": "uint256"
      }
    ],
    "name": "setTransferFeePercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxTxPercent",
        "type": "uint256"
      }
    ],
    "name": "setMaxTxPercent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_router",
        "type": "address"
      }
    ],
    "name": "setRouter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawLeftovers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawAlienToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tAmount",
        "type": "uint256"
      }
    ],
    "name": "deliver",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeFromReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "excludeFromFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "includeInFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_enabled",
        "type": "bool"
      }
    ],
    "name": "setSwapAndLiquifyEnabled",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "lock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isExcludedFromFee",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUnlockTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isExcludedFromReward",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tAmount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "deductTransferFee",
        "type": "bool"
      }
    ],
    "name": "reflectionFromToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rAmount",
        "type": "uint256"
      }
    ],
    "name": "tokenFromReflection",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

const StakingABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "RequestCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEV_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "createRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_stakingToken",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "admins",
        "type": "address[]"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "isCandidate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "stakedByAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakingToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  window: any;
  addresses: any;
  poolContractOpenSale: any;
  poolContractSimpleSwap: any;
  poolContractHarvest: any;
  poolContractIncomingSale: any;
  arcaneTokenContract: any;
  stakingContract: any;
  ltcTokenContract: any;
  uahTokenContract: any;
  lastKnownScrollPosition: number = 0;
  
  constructor(private _dialogService: AucDialogService) {}

  @HostListener('window:scroll', ['$event']) onWindowScroll(e: any) {
    if (window.localStorage.getItem('account') == null || window.localStorage.getItem('account') == 'undefined') {
      (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'none';
    }
    if(window.pageYOffset == 0) {
      let element = window.document.getElementById('header');
      element.style.position = 'static';
      return;
    }
    if (window.pageYOffset < this.lastKnownScrollPosition) {
      let element = window.document.getElementById('header');
      element.style.animation = 'slide-down 0.7s';
      element.style.position = 'fixed';
      element.style.top = '0';
      window.document.getElementById('how-it-works__line').style.height = '1px';
    } else if (50 < window.pageYOffset){
      (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('dropdown-content')).style.animation = 'slide-up 0.7s';
      setTimeout(()=>{
        (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'none';
      }, 650);
      let element = window.document.getElementById('header');
      element.style.animation = 'slide-up 0.7s';
      element.style.position = 'static';
      window.document.getElementById('how-it-works__line').style.height = '0.5px';
    }
    this.lastKnownScrollPosition = window.pageYOffset;
  }

  public async ngOnInit(): Promise<void> {

    if (window.localStorage.getItem('account') == null || window.localStorage.getItem('account') == 'undefined') {
      (<HTMLInputElement>document.getElementById('pools')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('user-icon')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('how-it-works__section')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('future-section')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('team__container')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('secure-section')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('pre-footer')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('footer')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('donate-window')).style.display = 'none';
    } else {            
      let account = window.localStorage.getItem('account');
      let firstLetters = account.substring(0, 4);
      let lastLetters = account.substring(38, 42);
      let subAddress = firstLetters + '...' + lastLetters;
      (<HTMLInputElement>document.getElementById('load-connect-wallet')).style.display = 'none';
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).innerText = subAddress;
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.background = '#383d51';
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.paddingLeft = '35px';
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.paddingRight = '35px';
      (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'none';

      (<HTMLInputElement>document.getElementById('pools')).style.display = 'flex';
      (<HTMLInputElement>document.getElementById('user-icon')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('future-section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('how-it-works__section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('team__container')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('secure-section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('pre-footer')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('footer')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('donate-window')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('donate-window')).style.animation = 'slide-left 0.7s';

      this.initContracts();
    }

    addEventListener('click', function handleClick(this: HTMLElement) {
      (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'none';
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
  }

  public openMetamask = async () => {
    window.web3 = new Web3Modal(window.ethereum);

    if (window.localStorage.getItem('account') == null || window.localStorage.getItem('account') == 'undefined') {
      try {
        this.addresses = await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{
              eth_accounts: {}
          }]
        }).then(() => window.ethereum.request({
            method: 'eth_requestAccounts'
        }));
      } catch (error) {
        console.error(error);
      }
      
      let firstLetters = this.addresses[0].substring(0, 4);
      let lastLetters = this.addresses[0].substring(38, 42);
      let subAddress = firstLetters + '...' + lastLetters;
      
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).innerText = subAddress;
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.background = '#383d51';
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.paddingLeft = '35px';
      (<HTMLInputElement>document.getElementById("connect-wallet-button")).style.paddingRight = '35px';
      (<HTMLInputElement>document.getElementById('load-connect-wallet')).style.display = 'none';

      (<HTMLInputElement>document.getElementById('pools')).style.display = 'flex';
      (<HTMLInputElement>document.getElementById('user-icon')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('future-section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('how-it-works__section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('team__container')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('secure-section')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('pre-footer')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('footer')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('donate-window')).style.display = 'block';
      (<HTMLInputElement>document.getElementById('donate-window')).style.animation = 'slide-left 0.7s';

      await window.localStorage.setItem('account', this.addresses[0]);

      this.initContracts();
    } 
    else {
      
      if((<HTMLInputElement>document.getElementById('dropdown-content')).style.display == 'none') {
        let account = window.localStorage.getItem('account');
        let firstLetters = account.substring(0, 7);
        let lastLetters = account.substring(38, 42);
        let subAddress = firstLetters + '...' + lastLetters;

        const version = await window.ethereum.request({ method: 'net_version' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        let network = 'ChainId: ' + chainId + ' Version: ' + version;

        (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'block';
        (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'none';
        (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'block';
        (<HTMLInputElement>document.getElementById('dropdown-content')).style.animation = 'slide-down 0.7s';
        (<HTMLInputElement>document.getElementById('account-describe-address')).innerText = subAddress;
        (<HTMLInputElement>document.getElementById('name-network')).innerText = network;
      } else {
        (<HTMLInputElement>document.getElementById('arrow-up')).style.display = 'none';
        (<HTMLInputElement>document.getElementById('arrow-down')).style.display = 'block';
        (<HTMLInputElement>document.getElementById('dropdown-content')).style.animation = 'slide-up 0.7s';
        setTimeout(()=>{
          (<HTMLInputElement>document.getElementById('dropdown-content')).style.display = 'none';
        }, 650);    
      }
    }
    
    return this.addresses.length ? this.addresses[0] : null;
  };

  public copyAddress = async() => {
    let inputElement = await this.getAccounts();
    let selBox = (<HTMLInputElement><unknown>document.createElement('textarea'));
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = inputElement[0];
    (<HTMLElement>document.body.appendChild(selBox));
    selBox.focus();
    selBox.select();
    (<HTMLElement><unknown>document.execCommand('copy'));
    (<HTMLElement>document.body.removeChild(selBox));
  }

  public disconnectWallet = async() => {
    window.web3 = new Web3Modal(window.ethereum);
    await window.web3.clearCachedProvider();
    await window.localStorage.removeItem('account');
    await window.localStorage.clear();
    await window.location.reload();
  }

  public closeDonateWindow = () => {
    const donateWindow = <HTMLInputElement>document.getElementById('donate-window');
    donateWindow.style.animation = 'slide-right 0.7s';
    setTimeout(() => {
      donateWindow.style.display = 'none';
    }, 700)
  }

  public scrollToElement(tag: any): void {
    console.log(1);
    
    (<HTMLInputElement>document.getElementById(tag)).scrollIntoView({ behavior: 'smooth' });
  }
  
  private getAccounts = async () => {
    try {
      return await window.ethereum.request({ method: 'eth_accounts' });
    } catch (e) {
      return [];
    }
  }

  private initContracts = async () => {
    window.web3 = new Web3(window.ethereum);

    this.poolContractOpenSale = new window.web3.eth.Contract(PoolABI, poolAddressOpenSale);
    this.poolContractSimpleSwap = new window.web3.eth.Contract(PoolABI, poolAddressSimpleSwap);
    this.poolContractHarvest = new window.web3.eth.Contract(PoolABI, poolAddressHarvest);
    this.poolContractIncomingSale = new window.web3.eth.Contract(PoolABI, poolAddressIncomingSale);
    this.arcaneTokenContract = new window.web3.eth.Contract(ArcaneTokenABI, arcaneTokenAddress);
    this.ltcTokenContract = new window.web3.eth.Contract(TokenABI, ltcTokenAddress);
    this.uahTokenContract = new window.web3.eth.Contract(TokenABI, uahTokenAddress);
    this.stakingContract = new window.web3.eth.Contract(StakingABI, stakingAddress);
    let account = await window.ethereum.selectedAddress;

    try {

      // 1 pool

      this.poolContractOpenSale.methods.getTimePoint().call().then((timePoint: any) => {
        this.startTimer((<HTMLInputElement>document.getElementById('pool-1-time-status')), +(timePoint.endDate) * 1000, true);
        (<HTMLInputElement>document.getElementById('pool-1-duration')).innerHTML = 
          `${Math.round((timePoint.endDate - timePoint.startDate) / 86400)} days`;
      });

      this.poolContractOpenSale.methods.getInfo().call().then((info: any) => {
        (<HTMLInputElement>document.getElementById('pool-1-name')).innerHTML = info.name;
        (<HTMLInputElement>document.getElementById('pool-1-type')).innerHTML = (info.vestingType == VESTING_TYPE.SWAP ? 'Swap' :
          info.vestingType == VESTING_TYPE.LINEAR_VESTING ? 'Linear' : 'Interval') + ' Pool'; 

        this.ltcTokenContract.methods.symbol().call().then((symbolVAM: any) => {
          this.uahTokenContract.methods.symbol().call().then((symbolUSD: any) => {
            (<HTMLInputElement>document.getElementById('pool-1-price')).innerHTML =
              `1.00 ${symbolVAM} = ${window.web3.utils.fromWei(info.tokenPrice)} ${symbolUSD}`;
            (<HTMLInputElement>document.getElementById('pool-1-invested-label')).innerHTML = `Invested, ${symbolUSD}`;

            (<HTMLInputElement>document.getElementById('pool-1-progress-bar-percents')).innerHTML = 
              `${Math.round(window.web3.utils.fromWei(info.totalDeposited) / 
              (window.web3.utils.fromWei(info.totalSupply) * window.web3.utils.fromWei(info.tokenPrice)) * 10000)/100}%`;
            (<HTMLInputElement>document.getElementById('pool-1-progress-bar')).style.width = 
            (<HTMLInputElement>document.getElementById('pool-1-progress-bar-percents')).innerHTML;

            (<HTMLInputElement>document.getElementById('pool-1-total-supply')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;

            this.poolContractOpenSale.methods.convertToCurrency(info.totalSupply).call().then((currency: any) => {
              (<HTMLInputElement>document.getElementById('pool-1-total-raise')).innerHTML = 
                `${this.round(window.web3.utils.fromWei(currency))} ${symbolUSD}`;
            });
            (<HTMLInputElement>document.getElementById('pool-1-total-supply-2')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;
          })
        })
      });

      (<HTMLInputElement>document.getElementById('pool-1-status')).innerHTML = 'Public';

      this.poolContractOpenSale.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
        (<HTMLInputElement>document.getElementById('pool-1-allocation-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
      });

      this.poolContractOpenSale.methods.deposited(account).call().then((deposited: any) => {
        (<HTMLInputElement>document.getElementById('pool-1-invested-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(deposited))}`;
      });

      // 2 pool      
      
      this.poolContractSimpleSwap.methods.getTimePoint().call().then((timePoint: any) => {
        this.startTimer((<HTMLInputElement>document.getElementById('pool-2-time-status')), +(timePoint.endDate) * 1000, true);
        (<HTMLInputElement>document.getElementById('pool-2-duration')).innerHTML = 
          `${Math.round((timePoint.endDate - timePoint.startDate) / 86400)} days`;
      });

      this.poolContractSimpleSwap.methods.getInfo().call().then((info: any) => {
        (<HTMLInputElement>document.getElementById('pool-2-name')).innerHTML = info.name;
        (<HTMLInputElement>document.getElementById('pool-2-type')).innerHTML = (info.vestingType == VESTING_TYPE.SWAP ? 'Swap' :
          info.vestingType == VESTING_TYPE.LINEAR_VESTING ? 'Linear' : 'Interval') + ' Pool'; 

        this.arcaneTokenContract.methods.symbol().call().then((symbolVAM: any) => {
          this.uahTokenContract.methods.symbol().call().then((symbolUSD: any) => {
            (<HTMLInputElement>document.getElementById('pool-2-price')).innerHTML =
              `1.00 ${symbolVAM} = ${window.web3.utils.fromWei(info.tokenPrice)} ${symbolUSD}`;
            (<HTMLInputElement>document.getElementById('pool-2-invested-label')).innerHTML = `Invested, ${symbolUSD}`;

            (<HTMLInputElement>document.getElementById('pool-2-progress-bar-percents')).innerHTML = 
              `${Math.round(window.web3.utils.fromWei(info.totalDeposited) / 
              (window.web3.utils.fromWei(info.totalSupply) * window.web3.utils.fromWei(info.tokenPrice)) * 10000)/100}%`;
            (<HTMLInputElement>document.getElementById('pool-2-progress-bar')).style.width = 
            (<HTMLInputElement>document.getElementById('pool-2-progress-bar-percents')).innerHTML;

            (<HTMLInputElement>document.getElementById('pool-2-total-supply')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;

            this.poolContractSimpleSwap.methods.convertToCurrency(info.totalSupply).call().then((currency: any) => {
              (<HTMLInputElement>document.getElementById('pool-2-total-raise')).innerHTML = 
                `${this.round(window.web3.utils.fromWei(currency))} ${symbolUSD}`;
            });
            (<HTMLInputElement>document.getElementById('pool-2-total-supply-2')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;
          })
        })
      });

      (<HTMLInputElement>document.getElementById('pool-2-status')).innerHTML = 'Public';

      this.poolContractSimpleSwap.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
        (<HTMLInputElement>document.getElementById('pool-2-allocation-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
      });

      this.poolContractSimpleSwap.methods.deposited(account).call().then((deposited: any) => {
        (<HTMLInputElement>document.getElementById('pool-2-invested-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(deposited))}`;
      });

      // 3 pool      
      
      (<HTMLInputElement>document.getElementById('pool-3-time-status')).innerText = 'Ended';

      this.poolContractHarvest.methods.getInfo().call().then((info: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-name')).innerHTML = info.name;
        (<HTMLInputElement>document.getElementById('pool-3-type')).innerHTML = (info.vestingType == VESTING_TYPE.SWAP ? 'Swap' :
          info.vestingType == VESTING_TYPE.LINEAR_VESTING ? 'Linear' : 'Interval') + ' Pool'; 

        this.ltcTokenContract.methods.symbol().call().then((symbolVAM: any) => {
          this.uahTokenContract.methods.symbol().call().then((symbolUSD: any) => {
            (<HTMLInputElement>document.getElementById('pool-3-price')).innerHTML =
              `1.00 ${symbolVAM} = ${window.web3.utils.fromWei(info.tokenPrice)} ${symbolUSD}`;
            (<HTMLInputElement>document.getElementById('pool-3-invested-label')).innerHTML = `Invested, ${symbolUSD}`;

            (<HTMLInputElement>document.getElementById('pool-3-progress-bar-percents')).innerHTML = 
              `${Math.round(window.web3.utils.fromWei(info.totalDeposited) / 
              (window.web3.utils.fromWei(info.totalSupply) * window.web3.utils.fromWei(info.tokenPrice)) * 10000)/100}%`;
            (<HTMLInputElement>document.getElementById('pool-3-progress-bar')).style.width = 
            (<HTMLInputElement>document.getElementById('pool-3-progress-bar-percents')).innerHTML;

            (<HTMLInputElement>document.getElementById('pool-3-total-supply')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;

            this.poolContractHarvest.methods.convertToCurrency(info.totalSupply).call().then((currency: any) => {
              (<HTMLInputElement>document.getElementById('pool-3-total-raise')).innerHTML = 
                `${this.round(window.web3.utils.fromWei(currency))} ${symbolUSD}`;
            });
            (<HTMLInputElement>document.getElementById('pool-3-total-supply-2')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;
          })
        })
      });

      (<HTMLInputElement>document.getElementById('pool-3-status')).innerHTML = 'Public';

      this.poolContractHarvest.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-allocation-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
      });

      this.poolContractHarvest.methods.deposited(account).call().then((deposited: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-invested-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(deposited))}`;
      });

      this.poolContractHarvest.methods.getBalanceInfo(account).call().then((balance: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-locked')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(balance[0]))} Tokens`;
      });

      this.poolContractHarvest.methods.getBalanceInfo(account).call().then((balance: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-available')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(balance[1]))} Tokens`;
      });

      this.poolContractHarvest.methods.rewardsPaid(account).call().then((balance: any) => {
        (<HTMLInputElement>document.getElementById('pool-3-received')).innerHTML = 
        `${this.round(Number(window.web3.utils.fromWei(balance)))} Tokens`
      });

      // 4 pool      
      
      this.poolContractIncomingSale.methods.getTimePoint().call().then((timePoint: any) => {
        this.startTimer((<HTMLInputElement>document.getElementById('pool-4-time-status')), +(timePoint.startDate) * 1000, false);
        (<HTMLInputElement>document.getElementById('pool-4-duration')).innerHTML = 
          `${Math.round((timePoint.endDate - timePoint.startDate) / 86400)} days`;
      });

      this.poolContractIncomingSale.methods.getInfo().call().then((info: any) => {
        (<HTMLInputElement>document.getElementById('pool-4-name')).innerHTML = info.name;
        (<HTMLInputElement>document.getElementById('pool-4-type')).innerHTML = (info.vestingType == VESTING_TYPE.SWAP ? 'Swap' :
          info.vestingType == VESTING_TYPE.LINEAR_VESTING ? 'Linear' : 'Interval') + ' Pool'; 

        this.ltcTokenContract.methods.symbol().call().then((symbolVAM: any) => {
          this.uahTokenContract.methods.symbol().call().then((symbolUSD: any) => {
            (<HTMLInputElement>document.getElementById('pool-4-price')).innerHTML =
              `1.00 ${symbolVAM} = ${window.web3.utils.fromWei(info.tokenPrice)} ${symbolUSD}`;
            (<HTMLInputElement>document.getElementById('pool-4-invested-label')).innerHTML = `Invested, ${symbolUSD}`;

            (<HTMLInputElement>document.getElementById('pool-4-progress-bar-percents')).innerHTML = 
              `${Math.round(window.web3.utils.fromWei(info.totalDeposited) / 
              (window.web3.utils.fromWei(info.totalSupply) * window.web3.utils.fromWei(info.tokenPrice)) * 10000)/100}%`;
            (<HTMLInputElement>document.getElementById('pool-4-progress-bar')).style.width = 
            (<HTMLInputElement>document.getElementById('pool-4-progress-bar-percents')).innerHTML;

            (<HTMLInputElement>document.getElementById('pool-4-total-supply')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;

            this.poolContractIncomingSale.methods.convertToCurrency(info.totalSupply).call().then((currency: any) => {
              (<HTMLInputElement>document.getElementById('pool-4-total-raise')).innerHTML = 
                `${this.round(window.web3.utils.fromWei(currency))} ${symbolUSD}`;
            });
            (<HTMLInputElement>document.getElementById('pool-4-total-supply-2')).innerHTML = 
              `${this.round(window.web3.utils.fromWei(info.totalSupply))} ${symbolVAM}`;
          })
        })
      });

      (<HTMLInputElement>document.getElementById('pool-4-status')).innerHTML = 'Public';

      this.poolContractIncomingSale.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
        (<HTMLInputElement>document.getElementById('pool-4-allocation-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
      });

      this.poolContractIncomingSale.methods.deposited(account).call().then((deposited: any) => {
        (<HTMLInputElement>document.getElementById('pool-4-invested-value')).innerHTML = 
          `${this.round(window.web3.utils.fromWei(deposited))}`;
      });

    } catch (error) {
      console.log(error);
    }
  }

  private startTimer(elementClock: any, time: any, isClosed: any) {
    const milliseconds = 1000;
    const timeValue = new Date(time);

    const idInterval = setInterval(() => {
        let t = Number(timeValue) - Number(new Date());
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));

        if (isClosed) elementClock.innerHTML = `Close in ${days}d ${hours}h ${minutes}m ${seconds}s`
        else elementClock.innerHTML = `Start through ${days}d ${hours}h ${minutes}m ${seconds}s`;
        time -= milliseconds;

        if (time < 1000) {
            clearInterval(idInterval);
            elementClock.innerHTML = '00 : 00 : 00';
        }
    }, milliseconds);
  }

  private round(x: any) {
    let num = Number(x).toLocaleString('ua-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num.toString().replaceAll(",", ".").replaceAll(" ", ",");
  }

  public onOpenDepositModalClick = async () => {
    let account = window.ethereum.selectedAddress;
    let maxValue;
    await this.poolContractOpenSale.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
      maxValue = `${(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
    });
    
    const data: AucTransferModalData = {
      header: 'Deposit',
      symbol: 'UAH',
      allowance: Number(maxValue),
      max: maxValue,
      approveButton: 'Approve',
      approvingButton: 'Approving...',
      confirmButton: 'Transfer',
      approve: () => {
        this.uahTokenContract.methods.approve(poolAddressOpenSale, 
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        return Promise.resolve();
      },
      confirm: () => {
        this.poolContractOpenSale.methods.deposit(
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        this.initContracts();
        return Promise.resolve();
      }
    };

    const ref = await this._dialogService.open<AucTransferModalComponent, AucTransferModalData>(AucTransferModalComponent, {
      data,
      dialogClass: 'transfer-dialog',
    });

    ref.afterClosed.subscribe((result: any) => {
      console.log('Transfer Dialog closed: ', result);
    });
  }

  public onOpenSwapModalClick = async() => {
    let account = window.ethereum.selectedAddress;
    let maxValue;
    await this.poolContractSimpleSwap.methods.getAvailAmountToDeposit(account).call().then((allocation: any) => {
      maxValue = `${(window.web3.utils.fromWei(allocation.maxAvailAllocation))}`;
    });

    const data: AucTransferModalData = {
      header: 'Swap',
      symbol: 'ARC',
      allowance: Number(maxValue),
      max: maxValue,
      approveButton: 'Approve',
      approvingButton: 'Approving...',
      confirmButton: 'Transfer',
      approve: () => {
        this.arcaneTokenContract.methods.approve(poolAddressSimpleSwap, 
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        return Promise.resolve();
      },
      confirm: () => {
        this.poolContractSimpleSwap.methods.deposit(
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        this.initContracts();
        return Promise.resolve();
      }
    };

    const ref = this._dialogService.open<AucTransferModalComponent, AucTransferModalData>(AucTransferModalComponent, {
      data,
      dialogClass: 'transfer-dialog',
    });

    ref.afterClosed.subscribe((result: any) => {
      console.log('Transfer Dialog closed: ', result);
    });
  }

  public onHarvestClick(): void {
    let account = window.ethereum.selectedAddress;
    this.poolContractHarvest.methods.harvest().send({from: account});
    this.initContracts();
  }

  public donateAmount(): void {
    let account = window.ethereum.selectedAddress;
    const data: AucTransferModalData = {
      header: 'Donate amount',
      symbol: 'ARC',
      allowance: '10000',
      max: '10000',
      approveButton: 'Approve',
      approvingButton: 'Approving...',
      confirmButton: 'Transfer',
      approve: () => {
        this.arcaneTokenContract.methods.approve(stakingAddress, 
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        return Promise.resolve();
      },
      confirm: () => {
        this.stakingContract.methods.stake(
          window.web3.utils.toWei(((<HTMLInputElement><unknown>document.getElementsByClassName('auc-input-field')[0]).value), 'ether')).send({from: account});
        return Promise.resolve();
      }
    };

    const ref = this._dialogService.open<AucTransferModalComponent, AucTransferModalData>(AucTransferModalComponent, {
      data,
      dialogClass: 'transfer-dialog',
    });

    ref.afterClosed.subscribe((result: any) => {
      console.log('Transfer Dialog closed: ', result);
    });
    this.closeDonateWindow();
  }
  
}
