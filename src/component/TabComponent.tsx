import {useRecoilValue} from 'recoil';
import RouterComponentAtom from '@/recoil/router-component.atom';
import {Container, ListGroup} from 'react-bootstrap';
import RouterComponentModel from '@/model/router-component.model';
import RouterControlUtil from '@/utils/router-control.util';
import style from '@/resources/style/tab-component.module.scss';
import IndexPage from '@/page/IndexPage';
import V1Page from '@/page/V1Page';
import V2Page from '@/page/V2Page';

const TabComponent = (): JSX.Element => {
  const componentModelValue = useRecoilValue(RouterComponentAtom);
  
  // 상단 탭 불러오기
  const getTab = (): JSX.Element => {
    const getTabName = (component: RouterComponentModel): string => {
      if (componentModelValue.filter(v => v.name === component.name).length > 1) {
        return `${component.name} (${component.sequence})`;
      }
      
      return component.name;
    }
    
    return (
      <div className={style.header}>
        {
          componentModelValue.map((component) => {
            return (
              <div
                key={component.uniqueKey}
                className={`${style.item} ${isActiveComponent(component) ? style.active : ''}`}
              >
                <button
                  className={style.btn}
                  onClick={() => RouterControlUtil.openComponent(component)}>
                  {getTabName(component)}
                </button>
                <button className={style.btnClose} onClick={() => RouterControlUtil.closeComponent(component)} />
              </div>
            )
          })
        }
      </div>
    )
  }
  
  // 보여줘야할 컴포넌트 불러오기
  const getComponent = (): JSX.Element => {
    if (componentModelValue.length === 0) return <>Click menu to load component!</>;
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
  
  const isActiveComponent = (component: RouterComponentModel): boolean => {
    const ac = getActiveComponent();
    return ac.uniqueKey === component.uniqueKey;
  }
  
  // 현재 활성상태의 컴포넌트 불러오기
  const getActiveComponent = (): RouterComponentModel => {
    const componentModel = componentModelValue.filter(v => v.active);
    if (componentModel.length === 0) {
      return {
        name: '',
        uniqueKey: '',
        component: <></>,
        sequence: 0,
        active: false
      }
    }
    
    return componentModel[0];
  }
  
  return (
    <Container style={{ marginTop: '10px' }} className={style.container}>
      <ListGroup className={style.sidebar}>
        <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<IndexPage name="홍길동" age={20} />, true)}>Index</ListGroup.Item>
        <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<V1Page />)}>page1</ListGroup.Item>
        <ListGroup.Item onClick={() => RouterControlUtil.saveOrUpdateComponent(<V2Page />, true)}>page2</ListGroup.Item>
      </ListGroup>
      <div className={style.mainItem}>
        {getTab()}
        {getComponent()}
      </div>
    </Container>
  )
}

export default TabComponent
