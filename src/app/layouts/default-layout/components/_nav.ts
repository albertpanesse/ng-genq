import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/-/dash',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Repository',
    url: '/-/repo',
    iconComponent: { name: 'cil-library' },
  },
  {
    name: 'SQL Query',
    url: '/-/sql',
    iconComponent: { name: 'cil-zoom' },
  },
  // {
  //   name: 'Connectors',
  //   url: '/-/conn',
  //   iconComponent: { name: 'cil-cloudy' },
  // },
  // {
  //   name: 'Query Pipeline',
  //   url: '/-/pipe',
  //   iconComponent: { name: 'cil-zoom' },
  // },
  // {
  //   name: 'Datasets',
  //   url: '/-/sets',
  //   iconComponent: { name: 'cil-storage' },
  // },
  {
    name: 'Visualization',
    url: '/-/visual',
    iconComponent: { name: 'cil-chart-line' },
  },
];
