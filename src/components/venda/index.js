import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

import Api       from '../../class/api'
import Security from '../../class/security';

const uri = 'sales';

const Produto = () => {

   const [lista, setLista]        = useState([]);
   const [products, setProducts]  = useState([]);

   const [loading, setLoading]    = useState(true);
   const [add, setAdd]            = useState(false);
   const [save, setSave]          = useState(false);
   const [user,setUser]           = useState(null)


   const onLista = useCallback( async () => {

        let user =  await Security.getKey('user');

        if(user !== null)
        {
 
             user = JSON.parse(user)[0]
 
             try{

                let result = await Api.get(`withdrawals/${user._id}`);
                setProducts(result);

                result = await Api.get(`${uri}/${user._id}`);
                setLista(result);
                setUser(user);

                setLoading(false);
             }catch(error){
                    setLista([]);
                    setLoading(false);
             }

       }

   },[lista]);


   const onSalvar = async() => {

         let fields = {products:'',employees:'',amount:0}

         fields['products']   = document.getElementById('product').value;
         fields['employees']  = user._id;
         fields['amount']     = parseInt(document.getElementById('amount').value,0);
      
         setSave(true);
 
        if(fields.products === '')
        {
            alert('Produto inválido');
            setSave(false);
            return false;
        }  

        if(fields.amount <= 0)
        {
            alert('Quantidade inválida');
            setSave(false);
            return false;
        } 

        let product_selected = await products.filter(item => item.products._id === fields.products);

        if(product_selected.length > 0)
        {
            
            if(fields.amount > product_selected[0].amount)
            {
                setSave(false);
                alert('Quantidade maior que disponível!');
                return false;
            }
        }
        else
        {
            setSave(false);
            alert('Produto não encontrado');
            return false;
        }


        try{
          let result = await Api.post(uri,fields);
          
          if(result.msg !== undefined)
          {
            alert(result.msg);
            setSave(false);

          }
          else 
          {

             onLista();
             setSave(false);
             setAdd(false);
          }

       }catch(error){
           setSave(false);
           setAdd(false);
           alert('Falha ao salvar o registro');
           console.log(error);
       }      

   };

   useEffect(() => {

      async function fetchData(){
          onLista();      
       }  
 
      fetchData();

   }, [])

    return(
        <div>
             <hr />
              
              <div style={{display:'flex',justifyContent:'space-between',marginLeft:50,marginRight:50}}>
                 <div>
                   <strong>Minhas Vendas ({user !== null ? user.name : ''})</strong>
                 </div> 
                 <div>
                  <Button onClick={() => setAdd(true)}>Adicionar</Button>
                  </div>  
              </div>
             <hr />
                <Table striped bordered>
                  <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Data</th>
                     </tr>
                  </thead>
                  <tbody>
           
                {lista.map(item => {
                 return (<tr key={item._id}>
                       <td>{item.products.description}</td>
                       <td>{item.amount}</td>
                       <td>{item.createdAt}</td>
                      </tr>
                    )
                })             
               }
               </tbody>
               </Table>

            {add &&    
            <Modal isOpen={add} backdrop={true} keyboard={false}>
                <ModalHeader >Registrar Venda</ModalHeader>
                <ModalBody>
                  <Form>

                  <FormGroup>
                      <Label for="product">Produto</Label>
                      <Input type="select" name="select" id="product">
                          {products.map(item => (
                            <option value={item.products._id}>{item.products.description}</option>
                         ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="amount">Quantidade em estoque</Label>
                        <Input type="number" name="amount" id="amount" placeholder="Quantidade em estoque"/>
                    </FormGroup>

                 </Form> 
                </ModalBody>
            <ModalFooter>
                <Button disabled={save} color="secondary" onClick={() => setAdd(false)}>Cancel</Button>
                <Button disabled={save} color="primary" onClick={onSalvar}>Salvar</Button>
            </ModalFooter>
            </Modal>
            }

            </div>
       
    )


  
}

export default React.memo(Produto);