import 'zone.js';
import { AucEthereum } from '@applicature/components';
import { Buffer } from 'buffer';
import process from 'process';
import Web3 from 'web3';

declare global {
  interface Window {
    // ethereum: AucEthereum;
    global: any;
    // web3: Web3;
  }
}

window.process = process;
window.global = window;
window.global.Buffer = global.Buffer || Buffer;
