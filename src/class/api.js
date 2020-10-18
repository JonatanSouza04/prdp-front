
import server_app from './server';

const urlBase = `${server_app}/`;

export default class Api {

   static get(url){
       
       return new Promise((resolve,reject) => {

            fetch(urlBase + url)
                .then(res => res.json())
                .then(
                (result) => {
                       resolve(result)
                    }, 
                (error) => {
                    reject(error)
                }
             )

       })
    }

    static post(url,body){

     return new Promise((resolve,reject) => {

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
    
        let requestOptions = {
          method: 'post',
          headers: headers,
          body: JSON.stringify(body)
        };        
   
        fetch(urlBase + url,requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
                   resolve(result)
               }, 
          (error) => {
            reject(error)
          }
        )    


     })

    }

}