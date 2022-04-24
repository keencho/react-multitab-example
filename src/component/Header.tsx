import {Container, Navbar} from 'react-bootstrap';

const Header = (): JSX.Element => {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="#home">멀티탭</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default Header
