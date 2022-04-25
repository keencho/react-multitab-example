import RouterComponentModel from '@/model/router-component.model';
import style from '@/resources/style/tab-component.module.scss';
import RouterControlUtil from '@/utils/router-control.util';
import {useRecoilValue} from 'recoil';
import RouterComponentAtom from '@/recoil/router-component.atom';
import {useDrag, useDrop} from 'react-dnd';
import {useRef} from 'react';

interface Props {
  component: RouterComponentModel,
  index: number,
}

const Tab = (props: Props): JSX.Element => {
  const componentModelValue = useRecoilValue(RouterComponentAtom);
  
  const [{isDragging}, dragRef] = useDrag(() => ({
    type: 'item',
    item: props.component,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  
  const [spec, dropRef] = useDrop({
    accept: 'item',
    hover: (item, monitor) => {
      RouterControlUtil.controlOrder(item as RouterComponentModel, props.index);
    }
  })
  
  const ref = useRef(null);
  const dragDropRef = dragRef(dropRef(ref));
  
  const opacity = isDragging  ? 0.3 : 1;
  
  return (
    <div
      // @ts-ignore
      ref={dragDropRef}
      className={`${style.item} ${RouterControlUtil.isActiveComponent(props.component) ? style.active : ''}`}
      style={{ ...style, opacity }}
    >
      <button
        className={style.btn}
        onClick={() => RouterControlUtil.openComponent(props.component)}>
        {RouterControlUtil.getTabName(props.component)}
      </button>
      <button className={style.btnClose} onClick={() => RouterControlUtil.closeComponent(props.component)} />
    </div>
  )
}

export default Tab
