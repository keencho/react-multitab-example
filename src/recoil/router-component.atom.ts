import {atom} from 'recoil';
import RouterComponentModel from '@/model/router-component.model';

const RouterComponentAtom = atom<RouterComponentModel[]>({
  key: 'routerComponent',
  default: []
});

export default RouterComponentAtom;
