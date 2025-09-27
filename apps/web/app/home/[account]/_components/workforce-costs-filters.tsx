'use client';

import { Button } from '@kit/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Filter, RotateCcw } from 'lucide-react';

export function WorkforceCostsFilters() {
  return (
    <div className="flex flex-col gap-4">
      
      
      <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtros</span>
      </div>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
            <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
            <SelectItem value="last-year">Último ano</SelectItem>
            <SelectItem value="ytd">Ano atual (YTD)</SelectItem>
            <SelectItem value="custom">Período personalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as áreas</SelectItem>
            <SelectItem value="ti">TI</SelectItem>
            <SelectItem value="rh">RH</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
            <SelectItem value="administrativo">Administrativo</SelectItem>
            <SelectItem value="operacoes">Operações</SelectItem>
            <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as filiais</SelectItem>
            <SelectItem value="sao-paulo">São Paulo</SelectItem>
            <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
            <SelectItem value="campinas">Campinas</SelectItem>
            <SelectItem value="salvador">Salvador</SelectItem>
            <SelectItem value="curitiba">Curitiba</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo de turnover" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="voluntario">Voluntário</SelectItem>
            <SelectItem value="involuntario">Involuntário</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Faixa etária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as idades</SelectItem>
            <SelectItem value="18-25">18-25 anos</SelectItem>
            <SelectItem value="26-35">26-35 anos</SelectItem>
            <SelectItem value="36-45">36-45 anos</SelectItem>
            <SelectItem value="46-55">46-55 anos</SelectItem>
            <SelectItem value="56+">56+ anos</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="feminino">Feminino</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
          </Button>
          <Button size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
