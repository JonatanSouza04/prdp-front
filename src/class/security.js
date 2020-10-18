import CryptoJS from 'crypto-js';

export default class Security {

   static setKey(ident,value){
        let p = CryptoJS.AES.encrypt(value,'prodap').toString();
        localStorage.setItem(`@${ident}`,p);
     
    }

    static getKey(ident){

     return new Promise((resolve,reject) => {

        try{ 
          let p = localStorage.getItem(`@${ident}`);

          if(p !== null)
          {
           let bytes = CryptoJS.AES.decrypt(p,'prodap');  
           resolve(bytes.toString(CryptoJS.enc.Utf8)); 
          }
          else
          resolve(null);

        }catch(error){
            reject(error);
        }

     })

    }


    static removeKey(ident){

      return new Promise((resolve,reject) => {
 
         try{ 
            localStorage.removeItem(`@${ident}`);
            resolve(true);
         }catch(error){
             reject(error);
         }
 
      })
 
     }    

}