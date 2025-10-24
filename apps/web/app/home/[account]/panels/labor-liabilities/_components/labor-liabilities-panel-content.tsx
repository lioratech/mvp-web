'use client';

import { Alert, AlertDescription } from '@kit/ui/alert';
import { AlertCircle } from 'lucide-react';

import { usePanelsFilters } from '../../../_contexts/panels-filters-context';
// TODO: Remover import abaixo quando implementar dados reais
import { LaborLiabilitiesPanels } from '../../../demo/labor-liabilities/_components/labor-liabilities-panels';

export function LaborLiabilitiesPanelContent() {
  const { selectedDepartment } = usePanelsFilters();

  return (
    <div className="space-y-6">
      {/* Alerta temporário - Remover quando implementar dados reais */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Modo de Desenvolvimento:</strong> Exibindo dados mockados
          temporariamente. A integração com dados reais será implementada em
          breve.
          {selectedDepartment && (
            <span className="block mt-1 text-sm">
              Filtro ativo: Departamento selecionado
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* TODO: Substituir pelo componente real quando implementar a API */}
      <LaborLiabilitiesPanels />
    </div>
  );
}

