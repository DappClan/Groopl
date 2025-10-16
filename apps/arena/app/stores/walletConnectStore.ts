import { defineStore } from 'pinia'

export const useWalletConnectStore = defineStore('walletConnect', {
  state: () => ({
    accountId: '',
    isConnected: false,
  }),
  actions: {
    setAccountId(newValue: string) {
      this.accountId = newValue
    },
    setIsConnected(newValue: boolean) {
      this.isConnected = newValue
    },
  },
})
