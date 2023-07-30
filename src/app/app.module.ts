import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

import { WalletInitOptions, WalletModule } from 'bnc-onboard/dist/src/interfaces';
import {
  AucAlertModule,
  AucDropdownMenuModule,
  AucAvatarModule,
  AucButtonModule,
  AucInputModule,
  AucConnectModule,
  AucWalletConnectService,
  AucNetworkOption,
  AUC_CHAIN_ID,
  AUC_CHAIN_ID_NUM,
  aucGetChainParams,
  AucBlockExplorerUrls,
  AucConnectWalletModule,
  AucNativeCurrencies,
  AucBlockExplorerApiUrl,
  AucTableModule,
} from '@applicature/components';

import { AppComponent } from './app.component';

const wallets: Array<WalletModule | WalletInitOptions> = [
  {
    walletName: 'metamask',
    preferred: true
  },
  {
    walletName: 'walletConnect',
    infuraKey: '${YOUR_INFURA_KEY}',
    preferred: true
  }
];

const networks = {
  eth: 1,
  kovanTestnet: AUC_CHAIN_ID_NUM.KOVAN_TESTNET,
  // ...
};

const supportedNetworks: AucNetworkOption[] = [
  {
    icon: 'assets/svg/network/eth.svg',
    name: 'Ethereum',
    chainId: AUC_CHAIN_ID.RINKEBY_TESTNET,
    symbol: AucNativeCurrencies[AUC_CHAIN_ID.RINKEBY_TESTNET].name,
    blockExplorerUrl: AucBlockExplorerUrls[AUC_CHAIN_ID.RINKEBY_TESTNET][0],
    isActive: false
  },
  {
    icon: 'assets/svg/network/bsc.svg',
    name: 'BSC',
    chainId: '0x61',
    symbol: 'BNB',
    blockExplorerUrl: 'https://testnet.bscscan.com',
    blockExplorerApiUrl: 'https://api-testnet.bscscan.com/api',
    isActive: false,
    chainParams: { // Custom Chain params
      chainId: '0x61',
      chainName: 'Binance Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'bnb',
        decimals: 18
      },
      rpcUrls: [ 'https://data-seed-prebsc-1-s1.binance.org:8545' ],
      blockExplorerUrls: [ 'https://testnet.bscscan.com' ]
    }
  }
];

export function initWalletServiceFactory(
  walletConnectService: AucWalletConnectService
): () => Observable<void> {
  return () => walletConnectService.initialize({
    networkId: networks.eth,
    walletSelect: { wallets }
  }, supportedNetworks);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AucAlertModule,
    AucAvatarModule,
    AucButtonModule,
    AucInputModule,
    AucConnectModule.forRoot(),
    AucDropdownMenuModule,
    AucConnectWalletModule,
    AucTableModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initWalletServiceFactory,
      deps: [ AucWalletConnectService ],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
