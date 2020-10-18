import React, { useState, useEffect } from 'react'
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import Security from '../../class/security';

import server_app from '../../class/server';
import Api from '../../class/api'

const uri = 'employees';

const Login = () => {
  
  const [isAuth, setIsAuth]    = useState(false);
  const [cpf,setCpf]           = useState('');


  const onValid = async () => {

          setIsAuth(true);

         try{
          let result = await Api.get(`${uri}/valid/${cpf}`)
         
          if(result.length > 0 && result[0]._id !== undefined)
          {
            setIsAuth(false);
            Security.setKey('user',JSON.stringify(result));

            window.location = '/';
          }
          else
          {
            setIsAuth(false);
            console.log(result);
          }
        }catch(error){
          setIsAuth(false);
          console.log(error);
        }
  }


 useEffect(() => {
   
    async function fetchData(){

    }  
 
   fetchData();

}, []);  


  return(

    <Container>
       <Row>
       <Col sm={{ size: 6, order: 2, offset: 1 }}>
       <Form>
         
          <FormGroup>
             <Label for="cpf">CPF</Label>
             <Input type="text" name="cpf" id="cpf" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} />
          </FormGroup>
         

          <Button disabled={isAuth} onClick={onValid}>Entrar</Button>

        </Form> 
      </Col>
      </Row> 
      </Container>  

    )
}

export default React.memo(Login);