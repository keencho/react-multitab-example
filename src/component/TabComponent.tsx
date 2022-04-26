import {useRecoilValue} from 'recoil';
import RouterComponentAtom from '@/recoil/router-component.atom';
import {Button, Container, ListGroup} from 'react-bootstrap';
import RouterControlUtil from '@/utils/router-control.util';
import style from '@/resources/style/tab-component.module.scss';
import IndexPage from '@/page/IndexPage';
import V1Page from '@/page/V1Page';
import V2Page from '@/page/V2Page';
import Tab from '@/component/Tab';

const TabComponent = (): JSX.Element => {
  const componentModelValue = useRecoilValue(RouterComponentAtom);
  
  // 보여줘야할 컴포넌트 불러오기
  const getActiveComponent = (): JSX.Element => {
    if (componentModelValue.length === 0) {
      return <></>;
    }
    
    return (
      <>
        {
          componentModelValue.map(component => {
            return (
              <div
                style={{ display: component.active ? 'block' : 'none' }}
                key={component.uniqueKey}
              >
                {component.component}
              </div>
            )
          })
        }
      </>
    )
  }
  
  return (
    <Container style={{ marginTop: '10px' }}>
      <Button onClick={() => RouterControlUtil.resetRecoilData()}>탭 전부 지우기</Button>
      <div className={style.container} >
        <ListGroup className={style.sidebar}>
          <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<IndexPage name="홍길동" age={20} />, true)}>Index</ListGroup.Item>
          <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<V1Page />)}>page1</ListGroup.Item>
          <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<V2Page />, true)}>page2</ListGroup.Item>
        </ListGroup>
        <div className={style.mainItem}>
          <div className={style.header}>
            {
              componentModelValue.map((component, idx) => {
                return <Tab key={component.uniqueKey} component={component} index={idx} />
              })
            }
          </div>
          {getActiveComponent()}
        </div>
      </div>
    </Container>
  )
}

export default TabComponent
