"use client";

import React from "react";
import { AlertTriangle, Brain, Clock, Lightbulb, TrendingUp, Users, Target, Zap, Heart, Download, Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@kit/ui/card";
import { Button } from "@kit/ui/button";
import { loadInsightsData } from './ia';
interface InsightsModelProps {
  panelType?: 'workforce' | 'financial' | 'sales';
  data?: {
    analyse: {
      current: string[];
      hiphotesis: string[];
      next_steps: {
        estrategico: string[];
        tatico: string[];
        operacional_cultural: string[];
      };
    };
  };
}

export function InsightsModel({ panelType = 'workforce', data }: InsightsModelProps) {
  const [insightsData, setInsightsData] = React.useState(data);

  React.useEffect(() => {
    if (!data) {
      loadInsightsData(panelType).then(setInsightsData);
    }
  }, [panelType, data]);

  const { analyse } = insightsData || { analyse: { current: [], hiphotesis: [], next_steps: { estrategico: [], tatico: [], operacional_cultural: [] } } };

  const handlePrint = () => {
    const printContent = document.getElementById('analise-liora-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const currentTime = new Date().toLocaleTimeString('pt-BR');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Análise Liora - Relatório</title>
            <style>
              @page { margin: 2cm; }
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 0;
                line-height: 1.6;
                color: #333;
              }
              .header { 
                text-align: center; 
                margin-bottom: 40px; 
                padding-bottom: 20px;
              }
              .logo-text {
                font-size: 32px;
                font-weight: 900;
                color: #2563eb;
                margin-bottom: 15px;
                letter-spacing: 3px;
                text-align: center;
              }
              .header h1 { 
                color: #1e40af; 
                margin: 0 0 10px 0; 
                font-size: 28px;
                font-weight: 700;
              }
              .header p { 
                color: #6b7280; 
                margin: 0 0 15px 0;
                font-size: 16px;
              }
              .date-info {
                font-size: 12px;
                color: #9ca3af;
                margin: 10px 0;
              }
              .section { 
                margin-bottom: 40px; 
                page-break-inside: avoid;
              }
              .section h3 { 
                color: #1f2937; 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 10px;
                margin-bottom: 20px;
                font-size: 20px;
                font-weight: 600;
              }
              .section-grid {
                display: block;
              }
              .column {
                margin-bottom: 30px;
                page-break-inside: avoid;
              }
              .column h4 {
                color: #374151;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                padding: 8px 0;
                text-align: left;
              }
              .column.analise-atual h4 {
                color: #2563eb;
              }
              .column.hipoteses h4 {
                color: #7c3aed;
              }
              .item { 
                margin-bottom: 12px; 
                padding: 12px 16px; 
                border-left: 4px solid #d1d5db;
                background-color: #fafafa;
                border-radius: 4px;
                page-break-inside: avoid;
              }
              .analise-atual .item {
                border-left: 4px solid #2563eb;
              }
              .hipoteses .item {
                border-left: 4px solid #7c3aed;
              }
              .item-text {
                font-size: 14px;
              }
              .next-steps {
                margin-top: 40px;
                page-break-before: always;
              }
              .steps-grid {
                display: block;
              }
              .step-category {
                margin-bottom: 25px;
                page-break-inside: avoid;
              }
              .step-category h4 {
                color: #1f2937;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 2px solid #e5e7eb;
              }
              .step-item {
                margin-bottom: 8px;
                padding: 8px 0;
                padding-left: 20px;
                position: relative;
                font-size: 13px;
              }
              .step-item::before {
                content: "•";
                position: absolute;
                left: 0;
                color: #6b7280;
                font-weight: bold;
              }
              .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
              }
            </style>
          </head>
          <body>
            <div class="header">
            <img src="http://localhost:3000/_next/image?url=%2Fimages%2Flogo%2Fliora.avif&w=128&q=75" alt="Liora" class="logo" />
              <h1>Análise Liora</h1>
              <p>Mais inteligência para a sua folha de pagamento</p>
              <div class="date-info">
                Relatório gerado em ${currentDate} às ${currentTime}
              </div>
            </div>
            
            <div class="section-grid">
              <div class="column analise-atual">
                <h4>Situação Atual</h4>
                ${analyse.current.map((item, index) => `
                  <div class="item">
                    <div class="item-text">${item}</div>
                  </div>
                `).join('')}
              </div>
              
              <div class="column hipoteses">
                <h4>Hipóteses</h4>
                ${analyse.hiphotesis.map((item, index) => `
                  <div class="item">
                    <div class="item-text">${item}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="next-steps">
              <h3>Próximos Passos</h3>
              <div class="steps-grid">
                <div class="step-category">
                  <h4>Estratégico</h4>
                  ${analyse.next_steps.estrategico.map(step => `
                    <div class="step-item">${step}</div>
                  `).join('')}
                </div>
                
                <div class="step-category">
                  <h4>Tático</h4>
                  ${analyse.next_steps.tatico.map(step => `
                    <div class="step-item">${step}</div>
                  `).join('')}
                </div>
                
                <div class="step-category">
                  <h4>Operacional/Cultural</h4>
                  ${analyse.next_steps.operacional_cultural.map(step => `
                    <div class="step-item">${step}</div>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Relatório gerado automaticamente pela plataforma Liora</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const printContent = document.getElementById('analise-liora-content');
      if (printContent) {
        if (typeof window !== 'undefined' && (window as any).html2pdf) {
          const element = printContent;
          const opt = {
            margin: 1,
            filename: 'analise-liora.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          (window as any).html2pdf().set(opt).from(element).save();
        } else {
          handlePrint();
        }
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      handlePrint();
    }
  };
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Análise Liora
                </CardTitle>
                <CardDescription>Mais inteligência para a sua folha de pagamento
                </CardDescription>

              </div>
            </div>
             <div className="flex items-center gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handleDownloadPDF}
                 className="flex items-center gap-2"
               >
                 <Download className="h-4 w-4" />
                 PDF
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handlePrint}
                 className="flex items-center gap-2"
               >
                 <Printer className="h-4 w-4" />
                 Imprimir
               </Button>
             </div>

          </div>
        </CardHeader>
        
        <CardContent id="analise-liora-content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Situação Atual</h3>
              </div>
              
              <div className="space-y-3">
                {analyse.current.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      {/* <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{index + 1}</span>
                      </div> */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Hipóteses</h3>
              </div>
              
              <div className="space-y-3">
                {analyse.hiphotesis.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      {/* <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">{index + 1}</span>
                      </div> */}
                      <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Próximos Passos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Estratégico</span>
                </div>
                <ul className="space-y-2">
                  {analyse.next_steps.estrategico.map((step, index) => (
                    <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Tático</span>
                </div>
                <ul className="space-y-2">
                  {analyse.next_steps.tatico.map((step, index) => (
                    <li key={index} className="text-sm text-orange-600 dark:text-orange-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Operacional/Cultural</span>
                </div>
                <ul className="space-y-2">
                  {analyse.next_steps.operacional_cultural.map((step, index) => (
                    <li key={index} className="text-sm text-green-600 dark:text-green-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </CardContent>

        <CardFooter className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Atualizado há 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">IA Ativa</span>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
