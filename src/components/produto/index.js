import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

import Api from '../../class/api'

const uri = 'products';

const Produto = () => {

   const [lista, setLista]            = useState([]);
   const [loading, setLoading]        = useState(true);
   const [add, setAdd]                = useState(false);
   const [save, setSave]              = useState(false);
 

   const onLista = useCallback( async () => {

        try{
           let result = await Api.get(uri);
           setLista(result);
           setLoading(false);
        }catch(error){
            setLista([]);
            setLoading(false);
        }

   },[lista]);


   const onSalvar = async() => {

         let fields = {code:'',description:'',amount:0,withdrawn:0,validated:0}

         fields['code']        = document.getElementById('code').value;
         fields['description'] = document.getElementById('description').value;
         fields['amount']      = document.getElementById('amount').value;

         setSave(true);
 
        if(fields.code.trim().length === 0)
        {
            alert('Código inválido');
            setSave(false);
            return false;
        }  

        if(fields.description.trim().length === 0)
        {
            alert('Descrição inválida');
            setSave(false);
            return false;
        }  

        if(fields.amount.value <= 0)
        {
            alert('Quantidade inválida');
            setSave(false);
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
                   <strong>Produtos</strong>
                 </div> 
                 <div>
                  <Button onClick={() => setAdd(true)}>Adicionar</Button>
                  </div>  
              </div>
             <hr />
                <Table striped bordered>
                  <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Quantidade em estoque</th>
                        <th>Qtd.retirada para venda</th>
                        <th>Validade fora do freezer em horas</th>
                     </tr>
                  </thead>
                  <tbody>
           
                {lista.map(item => {
                 return (<tr key={item._id}>
                       <td>{item.code}</td>
                       <td>{item.description}</td>
                       <td>{item.amount}</td>
                       <td>{item.withdrawn}</td>
                       <td>{item.validated}</td>
                      </tr>
                    )
                })             
               }
               </tbody>
               </Table>

            {add &&    
            <Modal isOpen={add} backdrop={true} keyboard={false}>
                <ModalHeader >Cadastrar Funcionário</ModalHeader>
                <ModalBody>
                  <Form>

                    <FormGroup>
                        <Label for="code">Código</Label>
                        <Input type="text" name="code" id="code" placeholder="Código" />
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Descrição</Label>
                        <Input type="text" name="description" id="description" placeholder="Descrição"/>
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