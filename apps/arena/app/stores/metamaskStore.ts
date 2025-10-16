import { defineStore } from 'pinia'

export const useMetamaskStore = defineStore('metamask', {
  state: () => ({
    metamaskAccountAddress: '',
  }),
  actions: {
    setMetamaskAccountAddress(newValue: string) {
      this.metamaskAccountAddress = newValue
    },
  },
})
