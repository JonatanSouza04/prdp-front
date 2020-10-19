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
                
                {form === '' && 
                
                 <div>
                    <ul>
                      <li>Cadastre um funcionário (Logue com o CPF criado)</li>
                      <li>Cadastre um produto com o seu estoque</li>
                      <li>Realiza uma retirada para venda (Estoque => Funcionário)</li>
                      <li>Registre um venda</li>
                    </ul>
                  </div>  
                }


            </div>
        </div>
    )


  
}

export default React.memo(Painel);