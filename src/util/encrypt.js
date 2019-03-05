const { Vue, JSEncrypt } = window
const encrypt = new JSEncrypt()
const publicKey = process.env.VUE_APP_PUBLIC_KEY

encrypt.setPublicKey(publicKey)

Vue.prototype.encrypt = password => encrypt.encrypt(password)

export default encrypt
