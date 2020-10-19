import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';

import Api       from '../../class/api'
import Security  from '../../class/security';
import { db_create, db_insert, db_select, db_exec }    from '../../class/websql';

const uri = 'sales';

const Produto = () => {

   const [lista, setLista]        = useState([]);
   const [products, setProducts]  = useState([]);
   const [productsCache, setProductsCache] = useState([]);
   const [loading, setLoading]    = useState(true);
   const [add, setAdd]            = useState(false);
   const [save, setSave]          = useState(false);
   const [user,setUser]           = useState(null);



   const onLista = useCallback( async () => {

        setLoading(true) 
        let user =  await Security.getKey('user');

        if(user !== null)
        {
 
              user = JSON.parse(user)[0]
              let result  = [];
              
             try{ 
               result = await Api.get(`withdrawals/${user._id}`);

               // Sempre atualiza a lista de produtos disponíveis.
               for(let i = 0; i < result.length; i++)
               {
                  db_exec('DELETE FROM withdrawals WHERE _id =? ',[result[i]._id]);
                  db_insert('INSERT INTO withdrawals (_id, employees, products, amount, status) VALUES(?,?,?,?,?)',[
                    result[i]._id, result[i].employees, JSON.stringify(result[i].products), result[i].amount, result[i].status
                  ]) 
               }
             }catch(error){
                
                result = [];
                let listWith = await db_select('SELECT _id, employees, products, amount, status FROM withdrawals');
                for(let i = 0; i < listWith.length; i++){
                    let item = listWith[i];
                    item.products = JSON.parse(item.products);
                    result.push(item);
                }
             }

              
              try{
                let listProducts = [];

                await result.map(item => {
                      let exists = listProducts.filter(list => list.products._id === item.products._id);
                      if(exists.length === 0)
                        listProducts.push(item)  
                      else
                      {
                        let index = listProducts.findIndex(i => i.products._id === item.products._id);
                        if(index !== -1)
                        listProducts[index].amount += item.amount; 
                      }   
                });

                setProducts(listProducts);

                try{
                  result = await Api.get(`${uri}/${user._id}`);
                }catch(error){
                    result = [];
                }


                for(let i = 0; i < result.length; i++){
                    result[i]['status'] = 1;
                }

                let semSincronizar = await onSelectLocal();

                if(semSincronizar.length > 0)
                {
               
                    for(let i = 0; i < semSincronizar.length; i++){
                        let item = semSincronizar[i];
                        item['_id'] = `item_${i}`;
                        let product = await db_select('SELECT * FROM products WHERE _id = ? ',[item.products]); 
                        if(product.length > 0)
                        {
                            item['products'] = product[0];
                            result.push(item);
                        }
                    }

                }

                setLista(result);
                setUser(user);

                setLoading(false);
             }catch(error){
                    setLista([]);
                    setLoading(false);
             }

       }

       setLoading(false);

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

        await onInsertLocal(fields); // Salva primeito local


        try{
          let result = await Api.post(uri,fields);
          
          if(result.msg !== undefined)
          {
           
              alert(result.msg);
              setSave(false);
             
          }
          else 
          {

             db_exec('UPDATE sales SET status = ? WHERE products = ? AND employees = ? ',[1,fields.products,fields.employees]); // Sincronizado
             onLista();
             setSave(false);
             setAdd(false);

          }

       }catch(error){
           setSave(false);
           setAdd(false);
           alert('Não foi possível inserir a venda no servidor');
           onLista();
      
       }      

   };

   const onInsertLocal = async (fields) => {

         return await new Promise( async(resolve,reject) => {
             try{ 
              await db_insert('INSERT INTO sales (products, employees, amount, status) VALUES(?,?,?,?)',[fields.products, fields.employees, fields.amount, 0])
              resolve(true);
             }catch(error){
                 reject(error);
             }
         }) 
   }

   const onSelectLocal = async () => {
  
        return await new Promise( async(resolve,reject) => {
           try{ 
              let select = await db_select('SELECT products, employees, amount, status FROM sales WHERE status = 0',[]);
              resolve(select === undefined ? [] : select);
            }catch(error){
              reject(error);
            }
        });

   }

   const onSinc = async () => {
       return await new Promise( async(resolve,reject) => {

                let semSincronizar = await onSelectLocal();

                for(let i = 0; i < semSincronizar.length; i++){
                     const { products, employees, amount } = semSincronizar[i];
                     try{ 
                        let fields = {products: products, employees: employees, amount: amount };
                        let result = await Api.post(uri,fields);
         
                        if(result.msg === undefined) //deu certo
                        db_exec('UPDATE sales SET status = ? WHERE products = ? AND employees = ? ',[1,fields.products,fields.employees]); // Sincronizado
                     }catch(error){

                     }  
  
                 }

                 resolve(true);
       });
         
   }

   useEffect(() => {

      async function fetchData(){
        
           
          await db_create('CREATE TABLE IF NOT EXISTS sales (products text, employees text, amount int, status int)')
          await db_create('CREATE TABLE IF NOT EXISTS withdrawals (_id text, products text, employees text, amount int, status int)');
       
          await onSinc(); // Sincroniza os pendentes
          await onLista();      

       }  
 
      fetchData();

   }, [])

    if(loading)
    return(<div style={{display:'flex',height:200,justifyContent:'center',alignItems:'center'}}><label>Carregando....</label></div>)

    return(
        <div>
             <hr />
              
              <div style={{display:'flex',justifyContent:'space-between',marginLeft:50,marginRight:50}}>
                 <div>
                   <strong>Minhas Vendas ({user !== null ? user.name : ''})</strong>
                   <p>Essa tela funciona de forma offline - deslique o servidor e registre uma venda</p>
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
                        <th>Sincronizado</th>
                     </tr>
                  </thead>
                  <tbody>
           
                {lista.map(item => {
                 return (<tr key={item._id}>
                       <td>{item.products.description}</td>
                       <td>{item.amount}</td>
                       <td>{item.createdAt !== undefined ? item.createdAt : ''}</td>
                       <td>{item.status === 1 ? 'Sim' : 'Não'}</td>
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
                            <option key={item._id} value={item.products._id}>{item.products.description}</option>
                         ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="amount">Quantidade</Label>
                        <Input type="number" name="amount" id="amount" placeholder="Quantidade"/>
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