import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/-/dsb',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'File Repository',
    url: '/-/frp',
    iconComponent: { name: 'cil-library' },
  },
  {
    name: 'External Data Source',
    url: '/-/eds',
    iconComponent: { name: 'cil-cloudy' },
  },
  {
    name: 'Data Query Pipeline',
    url: '/-/dqp',
    iconComponent: { name: 'cil-zoom' },
  },
  {
    name: 'Dataset Management',
    url: '/-/dmg',
    iconComponent: { name: 'cil-storage' },
  },
  {
    name: 'Data Visualization',
    url: '/-/dvz',
    iconComponent: { name: 'cil-chart-line' },
  },
];
