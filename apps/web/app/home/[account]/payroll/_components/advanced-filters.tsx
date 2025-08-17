'use client';

import { useState, useEffect } from 'react';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Checkbox } from '@kit/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@kit/ui/popover';
import { Calendar } from '@kit/ui/calendar';
import { CalendarIcon, Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AdvancedFilters, FilterOption } from './types';

interface AdvancedFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  options: {
    companies: FilterOption[];
    functions: FilterOption[];
    competencies: FilterOption[];
    events: FilterOption[];
  };
  loading?: boolean;
}

export function AdvancedFiltersComponent({ 
  filters, 
  onFiltersChange, 
  options, 
  loading 
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  // Estados para filtros
  const [companies, setCompanies] = useState<string[]>(filters.companies || []);
  const [functions, setFunctions] = useState<string[]>(filters.functions || []);
  const [competencies, setCompetencies] = useState<string[]>(filters.competencies || []);
  const [status, setStatus] = useState<('Ativo' | 'Inativo')[]>(filters.status || []);
  const [salaryRange, setSalaryRange] = useState<{ min: number; max: number }>(
    filters.salaryRange || { min: 0, max: 10000 }
  );
  const [admissionDate, setAdmissionDate] = useState<{ start: string; end: string }>(
    filters.admissionDate || { start: '', end: '' }
  );
  const [events, setEvents] = useState<string[]>(filters.events || []);

  // Filtrar opções baseado no termo de busca
  const getFilteredOptions = (options: FilterOption[], searchKey: string) => {
    const searchTerm = searchTerms[searchKey] || '';
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Aplicar filtros
  const applyFilters = () => {
    const newFilters: AdvancedFilters = {
      companies: companies.length > 0 ? companies : undefined,
      functions: functions.length > 0 ? functions : undefined,
      competencies: competencies.length > 0 ? competencies : undefined,
      status: status.length > 0 ? status : undefined,
      salaryRange: salaryRange.min > 0 || salaryRange.max < 10000 ? salaryRange : undefined,
      admissionDate: admissionDate.start || admissionDate.end ? admissionDate : undefined,
      events: events.length > 0 ? events : undefined,
    };
    onFiltersChange(newFilters);
  };

  // Limpar filtros
  const clearFilters = () => {
    setCompanies([]);
    setFunctions([]);
    setCompetencies([]);
    setStatus([]);
    setSalaryRange({ min: 0, max: 10000 });
    setAdmissionDate({ start: '', end: '' });
    setEvents([]);
    setSearchTerms({});
    onFiltersChange({});
  };

  // Contar filtros ativos
  const activeFiltersCount = [
    companies.length,
    functions.length,
    competencies.length,
    status.length,
    (salaryRange.min > 0 || salaryRange.max < 10000) ? 1 : 0,
    (admissionDate.start || admissionDate.end) ? 1 : 0,
    events.length
  ].reduce((acc, count) => acc + count, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros básicos sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Empresas */}
          <div className="space-y-2">
            <Label>Empresas</Label>
            <Select
              value={companies.length > 0 ? 'multiple' : ''}
              onValueChange={() => {}}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar empresas" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar empresas..."
                      value={searchTerms.companies || ''}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, companies: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {getFilteredOptions(options.companies, 'companies').map((company) => (
                      <div key={company.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                        <Checkbox
                          checked={companies.includes(company.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCompanies([...companies, company.id]);
                            } else {
                              setCompanies(companies.filter(id => id !== company.id));
                            }
                          }}
                        />
                        <Label className="text-sm">{company.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select>
            {companies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {companies.slice(0, 2).map((id) => {
                  const company = options.companies.find(c => c.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {company?.name}
                      <button
                        onClick={() => setCompanies(companies.filter(c => c !== id))}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {companies.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{companies.length - 2} mais
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Competências */}
          <div className="space-y-2">
            <Label>Competências</Label>
            <Select
              value={competencies.length > 0 ? 'multiple' : ''}
              onValueChange={() => {}}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar competências" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar competências..."
                      value={searchTerms.competencies || ''}
                      onChange={(e) => setSearchTerms(prev => ({ ...prev, competencies: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {getFilteredOptions(options.competencies, 'competencies').map((competency) => (
                      <div key={competency.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                        <Checkbox
                          checked={competencies.includes(competency.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCompetencies([...competencies, competency.id]);
                            } else {
                              setCompetencies(competencies.filter(id => id !== competency.id));
                            }
                          }}
                        />
                        <Label className="text-sm">{competency.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select>
            {competencies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {competencies.map((id) => {
                  const competency = options.competencies.find(c => c.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {competency?.name}
                      <button
                        onClick={() => setCompetencies(competencies.filter(c => c !== id))}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="space-y-2">
              {(['Ativo', 'Inativo'] as const).map((statusOption) => (
                <div key={statusOption} className="flex items-center space-x-2">
                  <Checkbox
                    checked={status.includes(statusOption)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatus([...status, statusOption]);
                      } else {
                        setStatus(status.filter(s => s !== statusOption));
                      }
                    }}
                  />
                  <Label className="text-sm">{statusOption}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros avançados (expandidos) */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Funções */}
              <div className="space-y-2">
                <Label>Funções</Label>
                <Select
                  value={functions.length > 0 ? 'multiple' : ''}
                  onValueChange={() => {}}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar funções" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar funções..."
                          value={searchTerms.functions || ''}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, functions: e.target.value }))}
                          className="pl-8"
                        />
                      </div>
                      <div className="mt-2 max-h-48 overflow-y-auto">
                        {getFilteredOptions(options.functions, 'functions').map((function_) => (
                          <div key={function_.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                            <Checkbox
                              checked={functions.includes(function_.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFunctions([...functions, function_.id]);
                                } else {
                                  setFunctions(functions.filter(id => id !== function_.id));
                                }
                              }}
                            />
                            <Label className="text-sm">{function_.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Faixa Salarial */}
              <div className="space-y-2">
                <Label>Faixa Salarial</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Valor Mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={salaryRange.min}
                      onChange={(e) => setSalaryRange(prev => ({ 
                        ...prev, 
                        min: parseInt(e.target.value) || 0 
                      }))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Valor Máximo</Label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={salaryRange.max}
                      onChange={(e) => setSalaryRange(prev => ({ 
                        ...prev, 
                        max: parseInt(e.target.value) || 10000 
                      }))}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ {salaryRange.min.toLocaleString('pt-BR')}</span>
                  <span>R$ {salaryRange.max.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Data de Admissão */}
            <div className="space-y-2">
              <Label>Data de Admissão</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">De</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {admissionDate.start ? format(new Date(admissionDate.start), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={admissionDate.start ? new Date(admissionDate.start) : undefined}
                        onSelect={(date) => setAdmissionDate(prev => ({ ...prev, start: date ? format(date, 'yyyy-MM-dd') : '' }))}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Até</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {admissionDate.end ? format(new Date(admissionDate.end), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={admissionDate.end ? new Date(admissionDate.end) : undefined}
                        onSelect={(date) => setAdmissionDate(prev => ({ ...prev, end: date ? format(date, 'yyyy-MM-dd') : '' }))}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Eventos */}
            <div className="space-y-2">
              <Label>Eventos</Label>
              <Select
                value={events.length > 0 ? 'multiple' : ''}
                onValueChange={() => {}}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar eventos..."
                        value={searchTerms.events || ''}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, events: e.target.value }))}
                        className="pl-8"
                      />
                    </div>
                    <div className="mt-2 max-h-48 overflow-y-auto">
                      {getFilteredOptions(options.events, 'events').map((event) => (
                        <div key={event.id} className="flex items-center space-x-2 p-2 hover:bg-accent rounded">
                          <Checkbox
                            checked={events.includes(event.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEvents([...events, event.id]);
                              } else {
                                setEvents(events.filter(id => id !== event.id));
                              }
                            }}
                          />
                          <Label className="text-sm">{event.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} disabled={loading}>
            Limpar Filtros
          </Button>
          <Button onClick={applyFilters} disabled={loading}>
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 