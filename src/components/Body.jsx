import React from 'react';
import Login from './Login';
import Browse from './Browse';
import MoviePage from './MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/browse/:type/:id/:listName",
    element: <MoviePage />
  }
]);

const Body = () => {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
