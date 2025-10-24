import { z } from 'zod';

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
    verifyMfa: z.string().min(1),
    callback: z.string().min(1),
    passwordReset: z.string().min(1),
    passwordUpdate: z.string().min(1),
  }),
  app: z.object({
    home: z.string().min(1),
    personalAccountSettings: z.string().min(1),
    personalAccountBilling: z.string().min(1),
    personalAccountBillingReturn: z.string().min(1),
    accountHome: z.string().min(1),
    // Painéis Analíticos (Produção)
    accountWorkforcePanels: z.string().min(1),
    accountTurnoverPanels: z.string().min(1),
    accountSalariesPanels: z.string().min(1),
    accountWorkforceCostsPanels: z.string().min(1),
    accountLaborLiabilitiesPanels: z.string().min(1),
    accountForecastsPanels: z.string().min(1),
    accountLeadershipPanels: z.string().min(1),
    // Painéis Demo
    accountExecutiveDemo: z.string().min(1),
    accountWorkforceDemo: z.string().min(1),
    accountTurnoverDemo: z.string().min(1),
    accountSalariesDemo: z.string().min(1),
    accountWorkforceCostsDemo: z.string().min(1),
    accountLaborLiabilitiesDemo: z.string().min(1),
    accountForecastsDemo: z.string().min(1),
    accountLeadershipDemo: z.string().min(1),
    // Outros
    accountSettings: z.string().min(1),
    accountBilling: z.string().min(1),
    accountMembers: z.string().min(1),
    accountBillingReturn: z.string().min(1),
    joinTeam: z.string().min(1),
  }),
});

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    verifyMfa: '/auth/verify',
    callback: '/auth/callback',
    passwordReset: '/auth/password-reset',
    passwordUpdate: '/update-password',
  },
  app: {
    home: '/home',
    personalAccountSettings: '/home/settings',
    personalAccountBilling: '/home/billing',
    personalAccountBillingReturn: '/home/billing/return',
    accountHome: '/home/[account]/panels/executive',
    // Painéis Analíticos (Produção)
    accountWorkforcePanels: `/home/[account]/panels/workforce`,  
    accountWorkforceCostsPanels: `/home/[account]/panels/workforce-costs`,
    accountLaborLiabilitiesPanels: `/home/[account]/panels/labor-liabilities`,
    accountSalariesPanels: `/home/[account]/panels/salaries`,
    accountTurnoverPanels: `/home/[account]/panels/turnover`,
    accountForecastsPanels: `/home/[account]/panels/forecasts`,
    accountLeadershipPanels: `/home/[account]/panels/leadership`,
    // Painéis Demo
    accountExecutiveDemo: `/home/[account]/demo/executive`,
    accountWorkforceDemo: `/home/[account]/demo/workforce`,
    accountWorkforceCostsDemo: `/home/[account]/demo/workforce-costs`,
    accountLaborLiabilitiesDemo: `/home/[account]/demo/labor-liabilities`,
    accountSalariesDemo: `/home/[account]/demo/salaries`,
    accountTurnoverDemo: `/home/[account]/demo/turnover`,
    accountForecastsDemo: `/home/[account]/demo/forecasts`,
    accountLeadershipDemo: `/home/[account]/demo/leadership`,
    // Outros
    accountSettings: `/home/[account]/settings`,
    accountBilling: `/home/[account]/billing`,
    accountMembers: `/home/[account]/members`,
    accountBillingReturn: `/home/[account]/billing/return`,
    joinTeam: '/join',
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
