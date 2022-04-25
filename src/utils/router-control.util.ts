import {getRecoil, setRecoil} from '@/recoil/RecoilNexus';
import RouterComponentAtom from '@/recoil/router-component.atom';
import RouterComponentModel from '@/model/router-component.model';

export default class RouterControlUtil {
  
  static MAX_TAB_SIZE = 15;
  static MAX_TAB_MESSAGE = `최대 탭 갯수에 도달하였습니다. (${this.MAX_TAB_SIZE} 개)`;
  
  static atom = RouterComponentAtom;
  static recoilData = getRecoil(this.atom);
  
  // 컴포넌트 저장 & 업데이트
  static saveOrUpdateComponent = (component: JSX.Element, allowDuplicateTab?: boolean) => {
    const value: RouterComponentModel[] = getRecoil(this.atom)
    
    if (value.length >= this.MAX_TAB_SIZE) {
      alert(this.MAX_TAB_MESSAGE);
      return;
    }
    
    //////////////////// 중복탭을 허용하지 않는 경우 ////////////////////
    if (allowDuplicateTab !== true) {
      // 만약 이미 recoil에 저장된 컴포넌트가 있다면 해당 컴포넌트의 show를 true로 세팅하고 끝낸다.
      if (value.some(v => v.displayName === component.type.name)) {
          this.setRecoil([ ...value.map(v => {
            return { ...v, active: v.displayName === component.type.name} as RouterComponentModel;
          })]);
        return;
      }
      
      // 없다면 새로 추가한다.
      this.setRecoil([ ...value.map(v => {
        return { ...v, active: false } as RouterComponentModel
      }), this.generateComponentModel(component)]);
      
      return;
    }
  
    //////////////////// 중복탭을 허용하는 경우 ////////////////////
    const componentModel: RouterComponentModel = this.generateComponentModel(component);
  
    // 중복탭을 허용하는경우 마지막 시퀀스를 찾아서 새롭게 만들 탭의 시퀀스를 +1 시켜줘야 한다.
    const filteredList = value.filter(v => v.displayName === component.type.name);
    if (filteredList.length === 0) {
      this.setRecoil([ ...value.map(v => {
        return { ...v, active: false } as RouterComponentModel
      }), componentModel ]);
      return;
    }
    
    const lastComponent = filteredList.sort((pv, nx) => pv.sequence - nx.sequence)[filteredList.length - 1];
    componentModel.sequence = lastComponent.sequence + 1;
   
    this.setRecoil([ ...value.map(v => {
      return { ...v, active: false } as RouterComponentModel
    }), componentModel ]);
  }
 
  // 컴포넌트 오픈
  static openComponent = (component: RouterComponentModel) => {
    const value: RouterComponentModel[] = getRecoil(this.atom)
    
    this.setRecoil([ ...value.map((v) => {
      return { ...v, active: this.isUniqueKeyEqual(v, component) } as RouterComponentModel
    })]);
  }
  
  // 컴포넌트 닫기
  static closeComponent = (component: RouterComponentModel) => {
    let value: RouterComponentModel[] = getRecoil(this.atom);
    const activeComponent: RouterComponentModel | undefined = value.find(v => v.active && this.isUniqueKeyEqual(component, v));
    const activeComponentIdx: number = value.findIndex(v => this.isUniqueKeyEqual(component, v));
    
    // 닫으려는 컴포넌트가 활성화된 컴포넌트라면 맨 앞에있는 컴포넌트를 활성 상태로 만든다 (0이라면 1)
    if (value.length > 1) {
      if (activeComponent !== undefined) {
        if (this.isUniqueKeyEqual(activeComponent, component)) {
          value = value.map((v, idx) => {
            return { ...v, active: (activeComponentIdx === 0 ? (idx === 1) : idx === 0) } as RouterComponentModel
          })
        }
      }
    }
    
    let filteredValue = value.filter(v => !this.isUniqueKeyEqual(v, component));
    
    // 시퀀스 재정렬
    if (filteredValue.length > 0) {
      filteredValue = filteredValue.map(v => {
        // 지워진 컴포넌트의 시퀀스보다 큰 시퀀스를 가진 컴포넌트
        if (v.displayName === component.displayName && v.sequence > component.sequence) {
          return { ...v, sequence: v.sequence - 1 } as RouterComponentModel;
        }
        return v ;
      });
    }
    
    this.setRecoil(filteredValue);
  }
  
  // 순서 지정
  static controlOrder = (currentComponent: RouterComponentModel, targetIndex: number) => {
    const componentModelValue: RouterComponentModel[] = getRecoil(this.atom)
    
    const draggedComponentIndex: number = componentModelValue.findIndex(value => value.uniqueKey === currentComponent.uniqueKey);
  
    if (targetIndex === draggedComponentIndex) return;
  
    const existingComponent = componentModelValue[targetIndex];
    const newComponentModelValue = componentModelValue.map((item, idx) => {
      if (idx === targetIndex) return { ...currentComponent, active: true } as RouterComponentModel;
      if (idx === draggedComponentIndex) return { ...existingComponent, active: false } as RouterComponentModel;
    
      return { ...item, active: false } as RouterComponentModel;
    });
    
    this.setRecoil(newComponentModelValue);
  }
  
  // recoil data 초기화
  static resetRecoilData = () => {
    setRecoil(this.atom, []);
  }
  
  // 활성화된 컴포넌트 가져오기
  static getActiveComponent = (): RouterComponentModel | undefined => {
    return getRecoil(this.atom).find(v => v.active);
  }
  
  // 탭 이름 가져오기
  static getTabName = (component: RouterComponentModel): string => {
    const componentList = getRecoil(this.atom);
  
    if (componentList.filter(v => v.displayName === component.displayName).length > 1) {
      return `${component.displayName} (${component.sequence})`;
    }
  
    return component.displayName;
  }
  
  // 현재 컴포넌트가 활성 컴포넌트인지 확인
  static isActiveComponent = (component: RouterComponentModel): boolean => {
    const activeComponent = this.getActiveComponent();
    if (activeComponent === undefined) return false;
    
    return component.uniqueKey === activeComponent.uniqueKey;
  }
  
  private static setRecoil(data: RouterComponentModel[]) {
    setRecoil(this.atom, data);
  }
  
  private static isUniqueKeyEqual = (componentOne: RouterComponentModel, componentTwo: RouterComponentModel): boolean => {
    return componentOne.uniqueKey === componentTwo.uniqueKey;
  }
  
  private static generateComponentModel = (component: JSX.Element): RouterComponentModel => {
    return {
      displayName: component.type.name,
      uniqueKey: crypto.randomUUID(),
      component: component,
      active: true,
      sequence: 1
    } as RouterComponentModel
  }
}
