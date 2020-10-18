import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

import Api from '../../class/api'

const uri = 'withdrawals';

const Retirada = () => {

   const [employees, setEmployees]  = useState([]);
   const [products, setProducts]    = useState([]);
   
   const [loading, setLoading]        = useState(true);
   const [add, setAdd]                = useState(false);
   const [save, setSave]              = useState(false);
 

   const onLista = useCallback( async () => {

        try{
           
           let result = await Api.get('products');
           setProducts(result);

           result = await Api.get('employees');
           setEmployees(result);

           setLoading(false);
        }catch(error){
            setLoading(false);
        }

   },[employees,products]);


   const onSalvar = async() => {

       let employee = document.getElementById('employee');
       let product  = document.getElementById('product');
       let amount   = document.getElementById('amount');
       

       let body = {employees:employee.value, products:product.value, amount: parseInt(amount.value,0),status:0}
     
       try{
        let result = await Api.post(uri,body);
        
        if(result.msg !== undefined)
        {
          alert(result.msg);
          setSave(false);

        }
        else 
        {

           alert('Retirada inserida com sucesso!');
           window.location = '/';

        }

     }catch(error){
         setSave(false);
         setAdd(false);
         alert('Falha ao salvar o registro');
     }     

   };

   useEffect(() => {

      async function fetchData(){
          onLista();      
       }  
 
      fetchData();

   }, [])

    if(loading)
    return(
      <div><label>Carregando...</label></div>
    )
    
    return(
        <div>
             <hr />
              
              <div style={{display:'flex',justifyContent:'space-between',marginLeft:50,marginRight:50}}>
                 <div>
                   <strong>Retirada para vendas</strong>
                 </div> 

              </div>
               <hr />
                  <Form style={{marginLeft:50, height:500,width:500}}>

                   <FormGroup>
                      <Label for="employee">Funcionário</Label>
                      <Input type="select" name="select" id="employee">
                          {employees.map(item => (
                            <option value={item._id}>{item.name}</option>
                         ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label for="product">Produto</Label>
                      <Input type="select" name="select" id="product">
                          {products.map(item => (
                            <option value={item._id}>{item.description} - (Qtd:{item.amount})</option>
                         ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="amount">Quantidade transferir</Label>
                        <Input type="number" name="amount" id="amount" placeholder="Quantidade para transferir" defaultValue={1}/>
                    </FormGroup>

                   <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Button disabled={save} color="secondary" onClick={() => window.location = '/'}>Cancel</Button>
                    <Button disabled={save} color="primary" onClick={onSalvar}>Retirar</Button>
                  </div>
                 </Form> 

            </div>
       
    )


  
}

export default React.memo(Retirada);