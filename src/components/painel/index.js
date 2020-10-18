import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import Menu from '../layout/menu'
import Funcionario from '../funcionario'
import Produto from '../produto'
import Retirada from '../retirada';
import Venda from '../venda';

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

                {form === 'produtos' && 
                  <Produto />
                }

                {form === 'retiradas' && 
                  <Retirada />
                }

                {form === 'vendas' && 
                  <Venda />
                }

            </div>
        </div>
    )


  
}

export default React.memo(Painel);