import TaskManager from '@/components/pages/TaskManager';

export const routes = {
  taskManager: {
    id: 'taskManager',
    label: 'Tasks',
    path: '/',
    icon: 'CheckSquare',
    component: TaskManager
  }
};

export const routeArray = Object.values(routes);
export default routes;