// Dynamic data loader for insights panels
export async function loadInsightsData(panelType: string) {
  switch (panelType) {
    case 'workforce':
      return (await import('./panel-workforce.json')).default;
    case 'turnover':
      return (await import('./panel-turnover.json')).default;
    case 'workforce-costs':
      return (await import('./panel-workforce-costs.json')).default;
    default:
      return (await import('./panel-workforce.json')).default;
  }
}
