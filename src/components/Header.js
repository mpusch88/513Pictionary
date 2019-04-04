import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Nav,
    Navbar,
    NavDropdown,
    Form,
    FormControl,
    Button
} from 'react-bootstrap';

class Header extends React.Component {

    render() {

        return (

            /*
            <Nav variant="pills" activeKey="1" class="mr-auto" onSelect={k => this.handleSelect(k)}>
                <Nav.Item>
                    <Navbar.Brand href="#home">
                        <img
                            src="/resources/logo.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="513Pictionary"
                        />
                    </Navbar.Brand>
                </Nav.Item>
                <NavDropdown  eventKey="2" title="Dropdown" id="nav-dropdown">
                    <Form inline>
                        <FormControl type="text" placeholder="user name to report" className="mr-sm-2" />
                        <FormControl type="text" placeholder="detailed message" className="mr-sm-2" />
                        <Button variant="outline-success">Submit</Button>
                        <Button variant="outline-success">Cancel</Button>
                    </Form>
                </NavDropdown>
            </Nav>
            */
           
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">513Pictionary</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Navbar.Text>
                            Signed in as:
                            <a href="#login">Mark Otto</a>
                        </Navbar.Text>
                    </Nav>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <Form inline>
                            <FormControl type="text" placeholder="user name to report" className="mr-sm-2"/>
                            <FormControl type="text" placeholder="detailed message" className="mr-sm-2"/>
                            <Button variant="outline-success">Submit</Button>
                            <Button variant="outline-success">Cancel</Button>
                        </Form>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

export default Header;
