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
      if (value.some(v => v.name === component.type.name)) {
          setRecoil(this.atom, [ ...value.map(v => {
            return { ...v, show: v.name === component.type.name};
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
    const filteredList = value.filter(v => v.name === component.type.name);
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
    
    setRecoil(this.atom, [ ...value.map((v) => {
      return { ...v, show: this.isUniqueKeyEqual(v, component) }
    })])
  }
  
  static closeComponent = (component: RouterComponentModel) => {
    let value: RouterComponentModel[] = getRecoil(this.atom);
    const activeComponent: RouterComponentModel | undefined = value.find(v => v.show && this.isUniqueKeyEqual(component, v));
    const activeComponentIdx: number = value.findIndex(v => this.isUniqueKeyEqual(component, v));
    
    // 닫으려는 컴포넌트가 활성화된 컴포넌트라면 맨 앞에있는 컴포넌트를 활성 상태로 만든다 (0이라면 1)
    if (value.length > 1) {
      if (activeComponent !== undefined) {
        if (this.isUniqueKeyEqual(activeComponent, component)) {
          value = value.map((v, idx) => {
            return { ...v, show: (activeComponentIdx === 0 ? (idx === 1) : idx === 0) }
          })
        }
      }
    }
    
    let filteredValue = value.filter(v => !this.isUniqueKeyEqual(v, component));
    
    // 시퀀스 재정렬
    if (filteredValue.length > 0) {
      filteredValue = filteredValue.map(v => {
        // 지워진 컴포넌트의 시퀀스보다 큰 시퀀스를 가진 컴포넌트
        if (v.name === component.name && v.sequence > component.sequence) {
          return { ...v, sequence: v.sequence - 1 };
        }
        return v;
      });
    }
    
    setRecoil(this.atom, filteredValue)
  }
  
  private static isUniqueKeyEqual = (componentOne: RouterComponentModel, componentTwo: RouterComponentModel): boolean => {
    return this.getUniqueKey(componentOne) === this.getUniqueKey(componentTwo);
  }
  
  private static getUniqueKey = (component: RouterComponentModel) => {
    return component.name + component.sequence;
  }
  
  private static generateComponentModel = (component: JSX.Element): RouterComponentModel => {
    return {
      name: component.type.name,
      uniqueKey: crypto.randomUUID(),
      component: component,
      show: true,
      sequence: 1
    }
  }
}
