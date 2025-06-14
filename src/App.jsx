import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from './Layout';
import { routes, routeArray } from './config/routes';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="font-body"
          progressClassName="bg-primary"
          className="z-[9999]"
        />
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;