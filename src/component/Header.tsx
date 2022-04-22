import {Container, Nav, Navbar} from 'react-bootstrap';
import IndexPage from '@/page/IndexPage';
import V1Page from '@/page/V1Page';
import V2Page from '@/page/V2Page';
import RouterControlUtil from '@/utils/router-control.util';

const Header = (): JSX.Element => {
  
  const controlComponent = (page: JSX.Element, allowDuplicateTab? : boolean) => {
    RouterControlUtil.saveOrUpdateComponent(page, allowDuplicateTab);
  }
  
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="#home">멀티탭</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => controlComponent(<IndexPage />, true)}>index</Nav.Link>
            <Nav.Link onClick={() => controlComponent(<V1Page />)}>v1</Nav.Link>
            <Nav.Link onClick={() => controlComponent(<V2Page />, true)}>v2</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
