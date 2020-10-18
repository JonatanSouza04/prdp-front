import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

import Menu from '../layout/menu'
import server_app from '../../class/server';

const url = `${server_app}/employees`;

const Funcionario = () => {

   const [lista, setLista]     = useState([]);
   const [loading, setLoading] = useState(true);
   const [add, setAdd]         = useState(false);
   const [cpf,setCpf]          = useState('');
   const [nome,setNome]        = useState('');
   const [save,setSave]        = useState(false);

   const onLista = useCallback(() => {

       fetch(url)
         .then(res => res.json())
         .then(
           (result) => {
                   setLista(result);
                   setLoading(false);
                }, 
           (error) => {
                 setLista([]);
                 setLoading(false);
           }
         )
   },[lista]);


   const onSalvar = () => {

        setSave(true);


        if(nome.trim().length === 0)
        {
            alert('Nome inválido');
            setSave(false);
            return false;
        }  

        let valueCPF = cpf !== '' ? cpf.match(/\d/g).join('') : '';

        if(valueCPF.length !== 11)
        {
            alert('CPF inválido');
            setSave(false);
            return false;
        }


        let headers = new Headers();
        headers.append("Content-Type", "application/json");
     
        let body = {name: nome, cpf: cpf }

        let requestOptions = {
          method: 'post',
          headers: headers,
          body: JSON.stringify(body)
        };        
   
        fetch(url,requestOptions)
        .then(res => res.json())
        .then(
          (result) => {

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
                  
               }, 
          (error) => {
              setSave(false);
              setAdd(false);
              alert('Falha ao salvar o registro');
          }
        )    

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
                   <strong>Funcionários</strong>
                 </div> 
                 <div>
                  <Button onClick={() => setAdd(true)}>Adicionar</Button>
                  </div>  
              </div>
             <hr />
                <Table striped bordered>
                  <thead>
                    <tr>
                        <th>#</th>
                        <th>CPF</th>
                        <th>Name</th>
                     </tr>
                  </thead>
                  <tbody>
           
                {lista.map(item => {
                 return (<tr key={item._id}>
                      <td>{item._id}</td>
                      <td>{item.cpf}</td>
                      <td>{item.name}</td>
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
                        <Label for="name">Nome</Label>
                        <Input type="text" name="name" id="name" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="cpf">CPF (Somente números)</Label>
                        <Input type="text" name="cpf" id="cpf" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} pattern="^[0-9]*$" maxLength={11}/>
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

export default React.memo(Funcionario);