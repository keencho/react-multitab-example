import {useRecoilValue} from 'recoil';
import RouterComponentAtom from '@/recoil/router-component.atom';
import {Button, Col, Container, Nav, Row} from 'react-bootstrap';
import RouterComponentModel from '@/model/router-component.model';
import RouterControlUtil from '@/utils/router-control.util';

const Box = (): JSX.Element => {
  const componentModelValue = useRecoilValue(RouterComponentAtom);
  
  const getHeader = (): JSX.Element => {
    const getTabName = (component: RouterComponentModel): string => {
      if (componentModelValue.filter(v => v.key === component.key).length > 1) {
        return `${component.key} (${component.sequence})`;
      }
      
      return component.key;
    }
    
    return (
      <Nav variant="tabs" defaultActiveKey={getActiveComponentKey()}>
        {
          componentModelValue.map((component) => {
            return (
              <div key={component.key + component.sequence} style={{ marginRight: '5px', marginBottom: '5px' }}>
                <Button
                  variant={component.key + component.sequence === getActiveComponentKeyAndSequence() ? 'primary' : 'dark'}
                  onClick={() => RouterControlUtil.openComponent(component)}
                >
                  {getTabName(component)}
                </Button>
                <Button onClick={() => RouterControlUtil.closeComponent(component)} variant='danger' size="sm">
                  닫기
                </Button>
              </div>
            )
          })
        }
      </Nav>
    )
  }
  
  const getComponent = (): JSX.Element => {
    if (componentModelValue.length === 0) return <>헤더에 있는 메뉴를 눌러보세요~</>;
    return (
      <>
        {
          componentModelValue.map(component => {
            return (
              <div
                style={{ display: component.show ? 'block' : 'none' }}
                key={component.key + component.sequence}
              >
                {component.component}
              </div>
            )
          })
        }
      </>
    )
  }
  
  const getActiveComponentKey = (): string => {
    return getActiveComponent().key;
  }
  
  const getActiveComponentKeyAndSequence = (): string => {
    const ac = getActiveComponent();
    return ac.key + ac.sequence;
  }
  
  const getActiveComponent = (): RouterComponentModel => {
    const componentModel = componentModelValue.filter(v => v.show);
    if (componentModel.length === 0) {
      return {
        key: '',
        component: <></>,
        sequence: 0,
        show: false
      }
    }
    
    return componentModel[0];
  }
  
  return (
    <Container style={{ marginTop: '10px' }}>
      {getHeader()}
      {getComponent()}
    </Container>
  )
}

export default Box
