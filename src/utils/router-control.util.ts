import {getRecoil, setRecoil} from '@/recoil/RecoilNexus';
import RouterComponentAtom from '@/recoil/router-component.atom';
import RouterComponentModel from '@/model/router-component.model';

export default class RouterControlUtil {
  
  static MAX_TAB_SIZE = 15;
  static MAX_TAB_MESSAGE = "최대 탭 갯수에 도달하였습니다.";
  
  static atom = RouterComponentAtom;
  
  static saveOrUpdateComponent = (component: JSX.Element, allowDuplicateTab?: boolean) => {
    const value: RouterComponentModel[] = getRecoil(this.atom)
    
    if (value.length >= this.MAX_TAB_SIZE) {
      alert(this.MAX_TAB_MESSAGE);
      return;
    }
    
    //////////////////// 중복탭을 허용하지 않는 경우 ////////////////////
    if (allowDuplicateTab !== true) {
      // 만약 이미 recoil에 저장된 컴포넌트가 있다면 해당 컴포넌트의 show를 true로 세팅하고 끝낸다.
      if (value.some(v => v.key === component.type.name)) {
          setRecoil(this.atom, [ ...value.map(v => {
            return { ...v, show: v.key === component.type.name};
          })
        ]);
        return;
      }
      
      // 없다면 새로 추가한다.
      setRecoil(this.atom, [ ...value.map(v => {
        return { ...v, show: false }
      }), this.generateComponentModel(component) ]);
      return;
    }
  
    //////////////////// 중복탭을 허용하는 경우 ////////////////////
    const componentModel: RouterComponentModel = this.generateComponentModel(component);
  
    // 중복탭을 허용하는경우 마지막 시퀀스를 찾아서 새롭게 만들 탭의 시퀀스를 +1 시켜줘야 한다.
    const filteredList = value.filter(v => v.key === component.type.name);
    if (filteredList.length === 0) {
      setRecoil(this.atom, [ ...value.map(v => {
        return { ...v, show: false }
      }), componentModel ]);
      return;
    }
    
    const lastComponent = filteredList.sort((pv, nx) => pv.sequence - nx.sequence)[filteredList.length - 1];
    componentModel.sequence = lastComponent.sequence + 1;
  
    setRecoil(this.atom, [ ...value.map(v => {
      return { ...v, show: false }
    }), componentModel ]);
  }
  
  static openComponent = (component: RouterComponentModel) => {
    const value: RouterComponentModel[] = getRecoil(this.atom)
    console.log(component);
    
    setRecoil(this.atom, [ ...value.map((v) => {
      return { ...v, show: v.key + v.sequence === component.key + component.sequence }
    })])
  }
  
  private static generateComponentModel = (component: JSX.Element): RouterComponentModel => {
    return {
      key: component.type.name,
      component: component,
      show: true,
      sequence: 1
    }
  }
}
