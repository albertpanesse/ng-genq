import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dsb',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'File Repository',
    url: '/frp',
    iconComponent: { name: 'cil-library' },
  },
  {
    name: 'Datasets Management',
    url: '/dmg',
    iconComponent: { name: 'cil-storage' },
  },
];
