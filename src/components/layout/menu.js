import React, { useState} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText
  } from 'reactstrap';
const Menu = () => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return(
        <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Home</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/funcionarios/">Funcionários</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/produtos/">Produtos</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/retiradas/">Retirada para venda</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/vendas/">Minhas Vendas</NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="/sair/">Sair</NavLink>
            </NavItem>

          </Nav>
          <NavbarText></NavbarText>
        </Collapse>
      </Navbar>
    </div>
    )
}

export default React.memo(Menu);