'use client';

import { useState } from 'react';
import { Upload, FileText, Building2, Eye, Download, AlertCircle, CheckCircle2, Loader2, X, FileIcon } from 'lucide-react';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Separator } from '@kit/ui/separator';
import { Badge } from '@kit/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@kit/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { useTranslation } from 'react-i18next';
import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';
import { savePayrollData } from '../_lib/server/save-payroll-data';

interface PayrollEvent {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor: number;
  tipo: 'P' | 'D';
}

interface PayrollEmployee {
  codigo: string;
  nome: string;
  cpf: string;
  situacao: string;
  data_admissao: string;
  vinculo: string;
  cc: string;
  depto: string;
  horas_mes: number;
  cargo_codigo: string;
  cargo_descricao: string;
  cbo: string;
  filial: string;
  salario: number;
  salario_base: number;
  eventos: PayrollEvent[];
  totais: {
    proventos: number;
    descontos: number;
    liquido: number;
  };
  bases: {
    base_inss: number;
    base_fgts: number;
    base_irrf: number;
    valor_fgts: number;
  };
}

interface PayrollCompetence {
  competencia: string;
  funcionarios: PayrollEmployee[];
}

interface PayrollCompany {
  cnpj: string;
  codigo: string;
  nome: string;
  competencia: string;
  emissao: string;
}

interface PayrollMetadata {
  data_inicio: string;
  data_fim: string;
  tempo_execucao_segundos: number;
}

interface PayrollData {
  empresa: PayrollCompany;
  competencias: PayrollCompetence[];
  metadata: PayrollMetadata;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export function UploadsContent() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [extractedData, setExtractedData] = useState<PayrollData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { account } = useTeamAccountWorkspace();

  const templates: Template[] = [
    { id: 'dominio', name: 'Domínio', description: 'Template para folhas de pagamento do sistema Domínio' },
    { id: 'contimatic', name: 'Contimatic', description: 'Template para folhas de pagamento do sistema Contimatic' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error(t('uploads:errors.invalidFileType'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('uploads:errors.fileTooLarge'));
      return;
    }

    setSelectedFile(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) return toast.error(t('uploads:errors.noFileSelected'));
    if (!selectedTemplate) return toast.error(t('uploads:errors.noTemplateSelected'));

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('template', selectedTemplate);

      const response = await fetch('https://api-extractor-production.up.railway.app/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Erro na API de extração (${response.status})`;
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          switch (response.status) {
            case 400:
              errorMessage = 'Arquivo inválido ou formato não suportado';
              break;
            case 413:
              errorMessage = 'Arquivo muito grande para processamento';
              break;
            case 415:
              errorMessage = 'Tipo de arquivo não suportado';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor de extração';
              break;
            case 503:
              errorMessage = 'Serviço de extração temporariamente indisponível';
              break;
            default:
              errorMessage = `Erro na API de extração (${response.status})`;
          }
        }
        
        toast.error(errorMessage);
        return;
      }

      const data = await response.json();
      setExtractedData(data);
      toast.success(t('uploads:processingSuccess'));
    } catch (error) {
      console.error('Erro na extração:', error);
      
      let errorMessage = t('uploads:processingError');
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Tempo limite excedido. Tente novamente.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Erro de rede. Verifique sua conexão.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveData = async () => {
    if (!extractedData || !account) return;

    setIsSaving(true);
    try {
      await toast.promise(
        savePayrollData(account.id, extractedData),
        {
          loading: 'Salvando dados...',
          success: 'Dados salvos com sucesso!',
          error: 'Erro ao salvar dados'
        }
      );
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <Trans i18nKey="uploads:uploadSection.title" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="uploads:uploadSection.description" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {!selectedFile ? (
                <div className="space-y-1.5">
                  <Label htmlFor="file-input" className="text-sm font-medium">
                    <Trans i18nKey="uploads:fileInput.label" />
                  </Label>
                  <Input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-9"
                  />
                  <p className="text-xs text-muted-foreground">
                    <Trans i18nKey="uploads:fileInput.help" />
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <FileIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-green-800 text-sm">{selectedFile.name}</span>
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Arquivo selecionado</span>
                            <span>•</span>
                            <span className={selectedFile.size > 8 * 1024 * 1024 ? 'text-orange-600 font-medium' : ''}>
                              {formatFileSize(selectedFile.size)}
                            </span>
                            {selectedFile.size > 8 * 1024 * 1024 && <span className="text-orange-600">• Próximo do limite</span>}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Template Selection */}
            <div className="space-y-2">
              <Label htmlFor="template-select" className="text-sm font-medium">
                <Trans i18nKey="uploads:templateSelect.label" />
              </Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder={t('uploads:templateSelect.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <span className="font-medium text-sm">{template.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Template selecionado</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Buttons */}
            <div className="space-y-2">
               <Button onClick={handleProcess} disabled={!selectedFile || !selectedTemplate || isProcessing} className="w-full h-10 text-sm font-medium">
                 {isProcessing ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> <Trans i18nKey="uploads:processing" />
                   </>
                 ) : (
                   <>
                     <Upload className="mr-2 h-4 w-4" /> <Trans i18nKey="uploads:processButton" />
                   </>
                 )}
               </Button>

              {(!selectedFile || !selectedTemplate) && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  <span>Selecione um arquivo e um template para processar</span>
                </div>
              )}

              {selectedFile && selectedTemplate && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg border text-xs font-medium text-muted-foreground">
                  <div>Debug Info:</div>
                  <div>Arquivo: {selectedFile.name}</div>
                  <div>Tamanho: {formatFileSize(selectedFile.size)}</div>
                  <div>Template: {selectedTemplate}</div>
                  <div>URL API: https://api-extractor-production.up.railway.app/extract</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <Trans i18nKey="uploads:previewSection.title" />
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="uploads:previewSection.description" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProcessing ? (
              <div className="text-center py-12 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <h3 className="text-lg font-semibold">Processando dados...</h3>
                <p className="text-sm text-muted-foreground">Extraindo informações da folha de pagamento</p>
              </div>
            ) : !extractedData ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Faça upload de um PDF e configure o processamento para ver os dados extraídos
                </p>
              </div>
            ) : (
              <>
                {/* Botão de Salvar */}
                <div className="mb-4">
                  <Button 
                    onClick={handleSaveData} 
                    disabled={isSaving}
                    className="w-full"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando dados...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Salvar Dados no Banco
                      </>
                    )}
                  </Button>
                </div>

                {/* Empresa */}
                <Card className="border-l-4 border-l-primary mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" /> {extractedData.empresa.nome}
                    </CardTitle>
                    <CardDescription>
                      CNPJ: {extractedData.empresa.cnpj} • Competência: {extractedData.empresa.competencia}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Código:</span>
                        <p className="font-mono">{extractedData.empresa.codigo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Emissão:</span>
                        <p>{extractedData.empresa.emissao}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Tempo de processamento:</span>
                        <p>{extractedData.metadata.tempo_execucao_segundos.toFixed(2)}s</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Competências */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Competências Processadas</h3>
                  <Accordion type="multiple" className="w-full">
                    {extractedData.competencias.map((competencia, competenciaIndex) => (
                      <AccordionItem key={competenciaIndex} value={`competencia-${competenciaIndex}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div className="text-left">
                              <div className="font-semibold">Competência: {competencia.competencia}</div>
                              <div className="text-sm text-muted-foreground">
                                {competencia.funcionarios.length} funcionário
                                {competencia.funcionarios.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {/* Resumo Estatístico */}
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                  <div>
                                    <p className="text-2xl font-bold text-blue-700">{competencia.funcionarios.length}</p>
                                    <p className="text-xs text-blue-600 font-medium">Funcionários</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-green-700">
                                      {formatCurrency(
                                        competencia.funcionarios.reduce((sum, f) => sum + f.totais.proventos, 0)
                                      )}
                                    </p>
                                    <p className="text-xs text-green-600 font-medium">Total Proventos</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-red-700">
                                      {formatCurrency(
                                        competencia.funcionarios.reduce((sum, f) => sum + f.totais.descontos, 0)
                                      )}
                                    </p>
                                    <p className="text-xs text-red-600 font-medium">Total Descontos</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-indigo-700">
                                      {formatCurrency(
                                        competencia.funcionarios.reduce((sum, f) => sum + f.totais.liquido, 0)
                                      )}
                                    </p>
                                    <p className="text-xs text-indigo-600 font-medium">Total Líquido</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {competencia.funcionarios.map((funcionario, idx) => (
                              <Card key={idx} className="border-l-4 border-l-green-500">
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-700 font-semibold text-sm">{funcionario.nome.charAt(0)}</span>
                                      </div>
                                      <div>
                                        <div className="font-semibold">{funcionario.nome}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {funcionario.cargo_descricao} • {funcionario.cpf}
                                        </div>
                                      </div>
                                    </div>
                                    <Badge variant={funcionario.situacao === 'Trabalhando' ? 'default' : 'secondary'}>
                                      {funcionario.situacao}
                                    </Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Informações Básicas */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Código</Label>
                                      <p className="font-mono text-sm">{funcionario.codigo}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">CPF</Label>
                                      <p className="font-mono text-sm">{funcionario.cpf}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Data Admissão</Label>
                                      <p className="text-sm">{funcionario.data_admissao}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Vínculo</Label>
                                      <p className="text-sm">{funcionario.vinculo}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Centro de Custo</Label>
                                      <p className="text-sm">{funcionario.cc}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Departamento</Label>
                                      <p className="text-sm">{funcionario.depto}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Horas/Mês</Label>
                                      <p className="text-sm">{funcionario.horas_mes}h</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">CBO</Label>
                                      <p className="font-mono text-sm">{funcionario.cbo}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-muted-foreground">Filial</Label>
                                      <p className="text-sm">{funcionario.filial}</p>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Valores Salariais */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-primary">Valores Salariais</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Salário</Label>
                                        <p className="text-lg font-semibold text-green-600">
                                          {formatCurrency(funcionario.salario)}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Salário Base</Label>
                                        <p className="text-lg font-semibold text-blue-600">
                                          {formatCurrency(funcionario.salario_base)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Totais */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-primary">Totais</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                        <Label className="text-xs font-medium text-green-700">Proventos</Label>
                                        <p className="text-lg font-bold text-green-800">
                                          {formatCurrency(funcionario.totais.proventos)}
                                        </p>
                                      </div>
                                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                                        <Label className="text-xs font-medium text-red-700">Descontos</Label>
                                        <p className="text-lg font-bold text-red-800">
                                          {formatCurrency(funcionario.totais.descontos)}
                                        </p>
                                      </div>
                                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <Label className="text-xs font-medium text-blue-700">Líquido</Label>
                                        <p className="text-lg font-bold text-blue-800">
                                          {formatCurrency(funcionario.totais.liquido)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Bases de Cálculo */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-primary">Bases de Cálculo</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Base INSS</Label>
                                        <p className="text-sm font-medium">{formatCurrency(funcionario.bases.base_inss)}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Base FGTS</Label>
                                        <p className="text-sm font-medium">{formatCurrency(funcionario.bases.base_fgts)}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Base IRRF</Label>
                                        <p className="text-sm font-medium">{formatCurrency(funcionario.bases.base_irrf)}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">Valor FGTS</Label>
                                        <p className="text-sm font-medium">{formatCurrency(funcionario.bases.valor_fgts)}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Eventos */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-sm text-primary">
                                      Eventos ({funcionario.eventos.length})
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {funcionario.eventos.map((evento, eventoIdx) => (
                                        <div
                                          key={eventoIdx}
                                          className={`flex items-center justify-between p-3 rounded-lg border ${
                                            evento.tipo === 'P'
                                              ? 'bg-green-50 border-green-200'
                                              : 'bg-red-50 border-red-200'
                                          }`}
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant={evento.tipo === 'P' ? 'default' : 'destructive'}
                                                className="text-xs"
                                              >
                                                {evento.tipo === 'P' ? 'Provento' : 'Desconto'}
                                              </Badge>
                                              <span className="font-medium text-sm">{evento.descricao}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              Código: {evento.codigo} • Qtd: {evento.quantidade}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p
                                              className={`font-semibold ${
                                                evento.tipo === 'P' ? 'text-green-700' : 'text-red-700'
                                              }`}
                                            >
                                              {formatCurrency(evento.valor)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
