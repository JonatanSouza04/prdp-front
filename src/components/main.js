import React, { useEffect, useState } from 'react';
import Login from './login'

import Security from '../class/security';
import ToolBar  from './layout/toolbar'
import Painel   from './painel'
import Api      from '../class/api';
import { db_insert, db_create, db_exec } from '../class/websql';
import Helpers from '../class/helpers';


const Main = ({form}) => {

   const [isAuth, setAuth]  = useState(true);
   const [logged,setLogged] = useState(false);


   useEffect(() => {

      async function fetchData(){
             

       
         await db_create('CREATE TABLE IF NOT EXISTS products (_id text, code text, description)')
         
         let ultModify = await Security.getKey('listProduct');
         // De 1 em 1 hora sincroniza a tabela de produtos
         let sinc = ultModify == null ? true : Helpers.diff_hours(new Date(), new Date(JSON.parse(ultModify)) ) >= 1 
          
         if(sinc)
         {
             
            let listProducts = [];
            try{
              await Api.get('products');
            } catch(error){
                listProducts = [];
            }

            listProducts.map( async (item) => {
                  await db_exec('DELETE FROM products WHERE _id = ?',[item._id]);
                  await db_insert('INSERT INTO products(_id, code,description) VALUES(?,?,?)',[item._id, item.code, item.description]);
            });
            await Security.setKey('listProduct',JSON.stringify(new Date()) );
        } 
  
         let user =  await Security.getKey('user');

         setLogged(user !== null && user.length > 0 && user[0]._id !== '' );
         setTimeout(() =>  setAuth(false), 500);


         if(form === 'sair')
         {
            Security.removeKey('user');

            setTimeout(() => window.locate = '/',1000);
         }
     
      }  
 
     fetchData();


   }, [isAuth])


    if(isAuth)
    return(
        <div>
            <ToolBar />
            
            <div style={{display:'flex',backgroundColor:'whitesmoke',justifyContent:'center'}}>
                <label>Aguarde</label>
            </div>
        </div>
    )


    if(logged)
    return(
        <div>
            <ToolBar />
            <Painel form={form} />
        </div>
    )

    return(
        <div>
             <ToolBar />
             <Login />
        </div>
    )
}

export default React.memo(Main);