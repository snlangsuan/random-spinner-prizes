import { defineStore, createPinia } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

interface IUserStore {
  uid: string | null
}

export const useUserStore = defineStore('user', {
  state: (): IUserStore => ({
    uid: null,
  }),
  actions: {
    setUid(uid: string) {
      this.uid = uid
    },
    clearUid() {
      this.uid = null
    },
    async checkAuthState() {
      const auth = getAuth()
      console.log({ auth: auth.currentUser })
      onAuthStateChanged(auth, (user) => {
        console.log('onAuthStateChanged ', user)
        if (user) {
          this.setUid(user.uid)
        } else {
          this.clearUid()
          navigateTo({ name: 'login' })
        }
      })
    },
  },
  persist: true,
})
