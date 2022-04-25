import React from 'react'
// @ts-ignore
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/component/Header';
import TabComponent from '@/component/TabComponent';
import {RecoilRoot} from 'recoil';
import RecoilNexus from '@/recoil/RecoilNexus';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <RecoilNexus />
    <Header />
    <DndProvider backend={HTML5Backend}>
      <TabComponent />
    </DndProvider>
  </RecoilRoot>
)
