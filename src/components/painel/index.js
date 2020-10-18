import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import Menu from '../layout/menu'
import Funcionario from '../funcionario'

const Painel = ({form}) => {

   const [menu, setMenu]  = useState(null);

   useEffect(() => {

      async function fetchData(){
             
            console.log('paibel',form);
      }  
 
     fetchData();

   }, [menu])

    return(
        <div>
            <div style={{backgroundColor:'white',justifyContent:'center'}}>
                <Menu />

                {form === 'funcionarios' && 
                  <Funcionario />
                }
            </div>
        </div>
    )


  
}

export default React.memo(Painel);