import React, { useEffect, useState } from 'react';
import Login from './login'

import Security from '../class/security';
import ToolBar from './layout/toolbar'
import Painel from './painel'

const Main = ({form}) => {

   const [isAuth, setAuth]  = useState(true);
   const [logged,setLogged] = useState(false);


   useEffect(() => {

      async function fetchData(){
             
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