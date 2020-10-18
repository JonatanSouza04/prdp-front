import React, { useState, useEffect } from 'react'
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import Security from '../../class/security';

import server_app from '../../class/server';

const Login = () => {
  
  const [isAuth, setIsAuth]    = useState(false);
  const [cpf,setCpf]           = useState('');


  const onValid = ({}) => {

          setIsAuth(true);

          let url = `${server_app}/employees/valid/${cpf}`;

          fetch(url)
               .then(res => res.json())
               .then(
                 (result) => {
                            
                           if(result.length > 0 && result[0]._id !== undefined)
                           {
                             setIsAuth(false);
                             Security.setKey('user',JSON.stringify(result));

                             window.location = '/';
                           }
                      }, 
                 (error) => {
                       setIsAuth(false);
                       console.log(error);
                 }
           )
  
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