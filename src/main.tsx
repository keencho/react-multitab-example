import React from 'react'
// @ts-ignore
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/component/Header';
import TabComponent from '@/component/TabComponent';
import {RecoilRoot} from 'recoil';
import RecoilNexus from '@/recoil/RecoilNexus';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <RecoilNexus />
    <Header />
    <TabComponent />
  </RecoilRoot>
)
