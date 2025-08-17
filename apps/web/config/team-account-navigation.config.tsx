import {
  CreditCard,
  LayoutDashboard,
  Settings,
  User,
  Users,
  Building2,
  Calendar,
  Tags,
  DollarSign,
  Upload
} from 'lucide-react';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const getRoutes = (
  account: string,
  workspace?: {
    account: {
      role: string;
      permissions: string[];
    };
  },
) => [
  {
    label: 'common:routes.application',
    children: [
      {
        label: 'common:routes.dashboard',
        path: pathsConfig.app.accountHome.replace('[account]', account),
        Icon: <LayoutDashboard className={iconClasses} />,
        end: true,
      },
    ],
  },
  {
    label: 'common:routes.settings',
    collapsible: false,
    children: [
      // Only show settings menu item for users with 'owner' role
      workspace?.account.role === 'owner'
        ? {
            label: 'common:routes.settings',
            path: createPath(pathsConfig.app.accountSettings, account),
            Icon: <Settings className={iconClasses} />,
          }
        : undefined,
      {
        label: 'common:routes.account',
        path: createPath('/home/[account]/user-settings', account),
        Icon: <User className={iconClasses} />,
      },
      workspace?.account.role === 'owner'
        ? {
            label: 'common:routes.members',
            path: createPath(pathsConfig.app.accountMembers, account),
            Icon: <Users className={iconClasses} />,
          }
        : undefined,
      featureFlagsConfig.enableTeamAccountBilling
        ? workspace?.account.role === 'owner'
          ? {
              label: 'common:routes.billing',
              path: createPath(pathsConfig.app.accountBilling, account),
              Icon: <CreditCard className={iconClasses} />,
            }
          : undefined
        : undefined,
    ].filter(Boolean),
  },
  {
    label: 'Setup',
    collapsible: true,
          children: [
        {
          label: 'departments:departments',
          path: createPath('/home/[account]/departments', account),
          Icon: <Building2 className={iconClasses} />,
        },
        {
          label: 'payroll-events:pageTitle',
          path: createPath('/home/[account]/payroll-events', account),
          Icon: <Tags className={iconClasses} />,
        },
        {
          label: 'payroll:page.title',
          path: createPath('/home/[account]/payroll', account),
          Icon: <DollarSign className={iconClasses} />,
        },
        {
          label: 'uploads:page.title',
          path: createPath('/home/[account]/uploads', account),
          Icon: <Upload className={iconClasses} />,
        },
      ],
  },
];

export function getTeamAccountSidebarConfig(
  account: string,
  workspace?: {
    account: {
      role: string;
      permissions: string[];
    };
  },
) {
  return NavigationConfigSchema.parse({
    routes: getRoutes(account, workspace),
    style: process.env.NEXT_PUBLIC_TEAM_NAVIGATION_STYLE,
    sidebarCollapsed: process.env.NEXT_PUBLIC_TEAM_SIDEBAR_COLLAPSED,
    sidebarCollapsedStyle: process.env.NEXT_PUBLIC_SIDEBAR_COLLAPSIBLE_STYLE,
  });
}

function createPath(path: string, account: string) {
  return path.replace('[account]', account);
}
