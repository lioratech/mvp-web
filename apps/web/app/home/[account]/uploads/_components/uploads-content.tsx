'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { Upload, FileText, Building2, Eye, Download, Settings, AlertCircle, CheckCircle2, Loader2, X, FileIcon } from 'lucide-react';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { If } from '@kit/ui/if';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Badge } from '@kit/ui/badge';
import { Separator } from '@kit/ui/separator';
import { Skeleton } from '@kit/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@kit/ui/accordion';
import { useTranslation } from 'react-i18next';

import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';

interface PayrollEvent {
  code: string;
  description: string;
  quantity: number | null;
  value: number;
}

interface PayrollEmployee {
  admission: string;
  cbo: string;
  condition: string;
  cpf: string;
  events: PayrollEvent[];
  function: string;
  name: string;
  salary_type: string;
}

interface PayrollCompany {
  address: string;
  cnpj: string;
  company_id: string;
  competency: string;
  employees: PayrollEmployee[];
}

interface PayrollData {
  data: PayrollCompany[];
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export function UploadsContent() {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [extractedData, setExtractedData] = useState<PayrollData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { account } = useTeamAccountWorkspace();

  // Dados mockados de templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Domínio',
      description: 'Template para folhas de pagamento do sistema Domínio',
    },
    {
      id: '2',
      name: 'Contimatic',
      description: 'Template para folhas de pagamento do sistema Contimatic',
    },
  ];



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é um PDF
      if (file.type !== 'application/pdf') {
        toast.error(t('uploads:errors.invalidFileType'));
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('uploads:errors.fileTooLarge'));
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error(t('uploads:errors.noFileSelected'));
      return;
    }

    if (!selectedTemplate) {
      toast.error(t('uploads:errors.noTemplateSelected'));
      return;
    }

    setIsProcessing(true);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('template', selectedTemplate);

        const response = await fetch('http://127.0.0.1:5001/extract', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setExtractedData(data);
        setIsProcessing(false);
        toast.success(t('uploads:processingSuccess'));
      } catch (error) {
        console.error('Erro na extração:', error);
        setIsProcessing(false);
        toast.error(t('uploads:processingError'));
      }
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Upload and Configuration */}
      <div className="space-y-6">
        {/* File Upload and Template Selection Section */}
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
            {/* File Upload */}
            <div className="space-y-2">
              <If condition={!selectedFile} fallback={
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <FileIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-green-800 text-sm">
                            {selectedFile?.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Arquivo selecionado</span>
                            <span>•</span>
                            <span>{formatFileSize(selectedFile?.size || 0)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          const fileInput = document.getElementById('file-input') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = '';
                          }
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              }>
                <div className="space-y-1.5">
                  <Label htmlFor="file-input" className="text-sm font-medium">
                    <Trans i18nKey="uploads:fileInput.label" />
                  </Label>
                  <div className="relative">
                    <Input
                      id="file-input"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 h-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <Trans i18nKey="uploads:fileInput.help" />
                  </p>
                </div>
              </If>
            </div>

            <Separator />

            {/* Template Selection */}
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label htmlFor="template-select" className="text-sm font-medium">
                  <Trans i18nKey="uploads:templateSelect.label" />
                </Label>
                <Select 
                  value={selectedTemplate} 
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder={t('uploads:templateSelect.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">{template.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <If condition={selectedTemplate}>
                {() => (
                  <div className="flex items-center gap-1.5 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Template selecionado</span>
                  </div>
                )}
              </If>
            </div>

            <Separator />

            {/* Process Button */}
            <div className="space-y-2">
              <Button 
                onClick={handleProcess} 
                disabled={!selectedFile || !selectedTemplate || isProcessing}
                className="w-full h-10 text-sm font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <Trans i18nKey="uploads:processing" />
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    <Trans i18nKey="uploads:processButton" />
                  </>
                )}
              </Button>
              
              <If condition={!selectedFile || !selectedTemplate}>
                {() => (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>Selecione um arquivo e um template para processar</span>
                  </div>
                )}
              </If>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Preview */}
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
            <If condition={isProcessing} fallback={
              <If condition={extractedData} fallback={
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  {/* <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    <Trans i18nKey="uploads:noDataExtracted" />
                  </h3> */}
                  <p className="text-sm text-muted-foreground">
                    Faça upload de um PDF e configure o processamento para ver os dados extraídos
                  </p>
                </div>
              }>
                {(data) => {
                  // Verificar se os dados têm a estrutura esperada
                  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <AlertCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                          Dados inválidos
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Os dados extraídos não possuem a estrutura esperada
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary">
                          Folhas de pagamento processadas
                        </h3>
                        <Badge variant="outline" className="text-sm">
                          {data.data.length} empresa{data.data.length > 1 ? 's' : ''}
                        </Badge>
                      </div>

                      <Accordion type="multiple" className="w-full">
                        {data.data.map((company, companyIndex) => (
                          <AccordionItem key={companyIndex} value={`company-${companyIndex}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-primary" />
                                <div className="text-left">
                                  <div className="font-semibold">
                                    {company.company_id} - {company.cnpj}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {company.competency} • {company.employees.length} funcionário{company.employees.length > 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-4">
                                {/* Informações da Empresa */}
                                <Card className="border-l-4 border-l-primary">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Informações da empresa</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium text-muted-foreground">CNPJ:</span>
                                        <p className="font-mono">{company.cnpj}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">ID:</span>
                                        <p>{company.company_id}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Competência:</span>
                                        <p>{company.competency}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-muted-foreground">Endereço:</span>
                                        <p className="text-xs">{company.address}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Cards dos Funcionários */}
                                <div className="space-y-4">
                                  {company.employees.map((employee, employeeIndex) => (
                                    <Card key={employeeIndex} className="border-l-4 border-l-green-500">
                                      <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                              <span className="text-green-700 font-semibold text-sm">
                                                {employee.name.charAt(0)}
                                              </span>
                                            </div>
                                            <div>
                                              <div className="font-semibold">{employee.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {employee.function} • {employee.cpf}
                                              </div>
                                            </div>
                                          </div>
                                          <Badge variant={employee.condition === 'Ativo' ? 'default' : 'secondary'}>
                                            {employee.condition}
                                          </Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-6">
                                        {/* Informações do Funcionário */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                          <div>
                                            <span className="font-medium text-muted-foreground">CBO:</span>
                                            <p>{employee.cbo}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-muted-foreground">Admissão:</span>
                                            <p>{employee.admission}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-muted-foreground">Tipo:</span>
                                            <p>{employee.salary_type}</p>
                                          </div>
                                          <div>
                                            <span className="font-medium text-muted-foreground">CPF:</span>
                                            <p className="font-mono">{employee.cpf}</p>
                                          </div>
                                        </div>

                                        <Separator />

                                        {/* Resumo Financeiro */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-primary">Resumo financeiro</h4>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {/* Salário Normal */}
                                            {(() => {
                                              const salaryEvent = employee.events.find(e => e.code === '001');
                                              return salaryEvent && (
                                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                  <div className="text-sm font-medium text-green-800">Salário normal</div>
                                                  <div className="text-lg font-bold text-green-700">
                                                    {formatCurrency(salaryEvent.value)}
                                                  </div>
                                                </div>
                                              );
                                            })()}

                                            {/* Total de Vencimentos */}
                                            {(() => {
                                              const totalEvent = employee.events.find(e => e.code === 'TOT_VENC_');
                                              return totalEvent && (
                                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                  <div className="text-sm font-medium text-blue-800">Total vencimentos</div>
                                                  <div className="text-lg font-bold text-blue-700">
                                                    {formatCurrency(totalEvent.value)}
                                                  </div>
                                                </div>
                                              );
                                            })()}

                                            {/* Valor Líquido */}
                                            {(() => {
                                              const liquidEvent = employee.events.find(e => e.code === '*LÍQUIDO*');
                                              return liquidEvent && (
                                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                  <div className="text-sm font-medium text-emerald-800">Valor líquido</div>
                                                  <div className="text-lg font-bold text-emerald-700">
                                                    {formatCurrency(liquidEvent.value)}
                                                  </div>
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        </div>

                                        <Separator />

                                        {/* Todos os Eventos */}
                                        <div className="space-y-3">
                                          <h4 className="font-semibold text-primary">Todos os Eventos</h4>
                                          <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {employee.events.map((event, eventIndex) => (
                                              <div key={eventIndex} className="flex justify-between items-center p-2 bg-muted/30 rounded border">
                                                <div className="flex items-center gap-2">
                                                  <Badge variant="outline" className="text-xs">
                                                    {event.code}
                                                  </Badge>
                                                  <span className="text-sm font-medium">{event.description}</span>
                                                  {event.quantity !== null && (
                                                    <span className="text-xs text-muted-foreground">
                                                      (Qtd: {event.quantity})
                                                    </span>
                                                  )}
                                                </div>
                                                <span className="font-semibold text-sm">
                                                  {formatCurrency(event.value)}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                }}
              </If>
            }>
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Processando dados...</h3>
                  <p className="text-sm text-muted-foreground">
                    Extraindo informações da folha de pagamento
                  </p>
                </div>
              </div>
            </If>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 