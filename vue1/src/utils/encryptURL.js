import CryptoJS from 'crypto-js/crypto-js.js'

function add_secret_key (userAuth) {
    let key = 'tech_win' + userAuth
    if (key.length < 32) {
        let a = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        key += a.slice(0, 32 - key.length)
    } else if (key.length > 32) {
        key = key.slice(0, 32)
    }
    console.log(key)
    return key

}

/**
 * 加密
 * @param word
 * import { aes_encrypt, aes_decrypt } from '../../libs/crypto'

 aes_encrypt(this.data)
 aes_decrypt(this.AES_data)
 * @param userAuth
 * @param is_json
 * @returns {string}
 */
export const aes_encrypt = (word, userAuth, is_json = true) => {
    if (is_json) {
        word = JSON.stringify(word)
    }
    const key = CryptoJS.enc.Utf8.parse(add_secret_key(userAuth)); //  s/iqSaaE0F3tsLgMCkCZjvqptKKzqD9/pMUnMkCwNjg= Set
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString()
}
/**
 * 解密
 * @param word
 * @param userAuth
 * @param is_json
 * @returns {string}
 */
export const aes_decrypt = (word, userAuth, is_json = true) => {
    const key = CryptoJS.enc.Utf8.parse(add_secret_key(userAuth));//  s/iqSaaE0F3tsLgMCkCZjvqptKKzqD9/pMUnMkCwNjg= Set
    const decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    let decrypt_text = CryptoJS.enc.Utf8.stringify(decrypt)
    if (is_json) {
        decrypt_text = JSON.parse(decrypt_text)
    }
    return decrypt_text
}

for (let i = 0; i < 10; i++) {
    let encData = aes_encrypt(i, 'cynic', false)
    console.log(encData)
    console.log(aes_decrypt(encData, 'cynic', false))
}

