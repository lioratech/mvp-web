'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, Position, MarkerType, EdgeTypes, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback } from '@kit/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@kit/ui/table';
import { Input } from '@kit/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@kit/ui/dropdown-menu';
import { Trans } from '@kit/ui/trans';
import { If } from '@kit/ui/if';

import { Search, Edit, Trash2, List, Network, Filter, Star, MoreVertical } from 'lucide-react';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

import { UpdatePositionDialog } from './update-position-dialog';
import { DeletePositionDialog } from './delete-position-dialog';
import { Tables } from '@kit/supabase/database';

type Position = Tables<'positions'>;
type ViewMode = 'table' | 'org-chart';

type PositionWithRelations = Position & {
  parent: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
};

export function PositionsList({ 
  accountId, 
  canManagePositions 
}: { 
  accountId: string;
  canManagePositions: boolean;
}) {
  const supabase = useSupabase();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  const { t } = useTranslation('positions');

  const { data: positions } = useQuery<PositionWithRelations[]>({
    queryKey: ['positions-with-relations', accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select(`
          *,
          parent:parent_id(id, name),
          department:department_id(id, name)
        `)
        .eq('account_id', accountId)
        .order('name');

      if (error) throw error;

      return (data as PositionWithRelations[]) || [];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: false,
  });

  const departments = useMemo(() => {
    if (!positions) return [];
    
    const uniqueDepartments = new Map<string, { id: string; name: string }>();
    
    positions.forEach(position => {
      if (position.department) {
        uniqueDepartments.set(position.department.id, position.department);
      }
    });
    
    return Array.from(uniqueDepartments.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [positions]);

  const parentPositions = useMemo(() => {
    if (!positions) return [];
    
    const uniqueParents = new Map<string, { id: string; name: string }>();
    
    positions.forEach(position => {
      if (position.parent) {
        uniqueParents.set(position.parent.id, position.parent);
      }
    });
    
    return Array.from(uniqueParents.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [positions]);

  const filteredPositions = useMemo(() => {
    if (!positions) return [];

    return positions.filter((position) => {
      const matchesSearch = !searchQuery.trim() || 
        position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.external_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || 
        (departmentFilter === 'none' && !position.department_id) ||
        position.department_id === departmentFilter;

      const matchesParent = parentFilter === 'all' || 
        (parentFilter === 'none' && !position.parent_id) ||
        position.parent_id === parentFilter;

      return matchesSearch && matchesDepartment && matchesParent;
    });
  }, [positions, searchQuery, departmentFilter, parentFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('positions:searchPlaceholder', 'Buscar por nome...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder={t('positions:filterByDepartment', 'Filtrar por departamento')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <Trans i18nKey="common:all2" defaults="Todos Departamentos" />
                  </SelectItem>
                  <SelectItem value="none">
                    <Trans i18nKey="positions:noDepartment" defaults="Sem departamento" />
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={parentFilter} onValueChange={setParentFilter}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder={t('positions:filterByParent', 'Filtrar por cargo superior')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <Trans i18nKey="common:all2" defaults="Todos Cargos" />
                  </SelectItem>
                  <SelectItem value="none">
                    <Trans i18nKey="positions:noParent" defaults="Sem cargo superior" />
                  </SelectItem>
                  {parentPositions.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table" className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    <Trans i18nKey="common:table" defaults="Tabela" />
                  </span>
                </TabsTrigger>
                <TabsTrigger value="org-chart" className="flex items-center space-x-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    <Trans i18nKey="positions:orgChart" defaults="Organograma" />
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="table" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:name" defaults="Nome" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:department" defaults="Departamento" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:parentPosition" defaults="Cargo Superior" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="positions:leadership" defaults="Liderança" />
                    </TableHead>
                    <TableHead>
                      <Trans i18nKey="common:status" defaults="Status" />
                    </TableHead>
                    <If condition={canManagePositions}>
                      <TableHead className="w-[100px]">
                        <Trans i18nKey="common:actions" defaults="Ações" />
                      </TableHead>
                    </If>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!filteredPositions || filteredPositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canManagePositions ? 7 : 6} className="h-24 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPositions.map((position) => (
                      <TableRow key={position.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback 
                              style={{ 
                                backgroundColor: position.color || '#6b7280',
                                color: 'white'
                              }}
                            >
                              {position.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{position.name}</div>
                            <If condition={position.external_id}>
                              <Badge variant="outline" className="font-mono text-xs mt-1">
                                {position.external_id}
                              </Badge>
                            </If>
                          </div>
                        </TableCell>
                        <TableCell>
                          {position.department ? (
                            <Badge variant="secondary" className="text-xs">
                              {position.department.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              <Trans i18nKey="common:notSet" defaults="Não definido" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {position.parent ? (
                            <span className="text-sm">{position.parent.name}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              <Trans i18nKey="common:none" defaults="Nenhum" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {position.is_leadership ? (
                            <Badge variant="default" className="text-xs">
                              <Trans i18nKey="positions:leader" defaults="Líder" />
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={position.is_active ? 'default' : 'secondary'}>
                            <Trans i18nKey={position.is_active ? 'positions:active' : 'positions:inactive'} 
                              defaults={position.is_active ? 'Ativo' : 'Inativo'} />
                          </Badge>
                        </TableCell>
                        <If condition={canManagePositions}>
                          <TableCell>
                            <div className="flex space-x-1">
                              <UpdatePositionDialog 
                                position={position}
                                accountId={accountId}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:edit" defaults="Editar" />
                                  </span>
                                </Button>
                              </UpdatePositionDialog>
                              
                              <DeletePositionDialog position={position} accountId={accountId}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    <Trans i18nKey="common:delete" defaults="Excluir" />
                                  </span>
                                </Button>
                              </DeletePositionDialog>
                            </div>
                          </TableCell>
                        </If>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="org-chart" className="mt-0">
            <If condition={!filteredPositions || filteredPositions.length === 0} fallback={
              <OrganizationChart 
                positions={filteredPositions}
                accountId={accountId}
                canManagePositions={canManagePositions}
              />
            }>
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <Trans i18nKey="common:noResults" defaults="Nenhum resultado encontrado" />
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  <Trans i18nKey="common:noResultsDescription" defaults="Tente ajustar sua busca" />
                </p>
              </div>
            </If>
           </TabsContent>
         </Tabs>
       </CardContent>
      
    </Card>
  );
}

function CustomNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <Card className={`w-56 shadow-lg border-0 bg-white ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ 
          background: '#6b7280',
          width: 8,
          height: 8,
          border: '2px solid white'
        }}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {data.name}
              </h3>
              {data.is_leadership && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>
            
            {data.department && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                {data.department.name}
              </Badge>
            )}
          </div>
          
          {selected && data.canManagePositions && (
            <div className="flex gap-1 ml-2">
              <UpdatePositionDialog
                position={data.position}
                accountId={data.accountId}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </UpdatePositionDialog>
              <DeletePositionDialog
                position={data.position}
                accountId={data.accountId}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-gray-100 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </DeletePositionDialog>
            </div>
          )}
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ 
          background: '#6b7280',
          width: 8,
          height: 8,
          border: '2px solid white'
        }}
      />
    </Card>
  );
}

const nodeTypes = {
  custom: CustomNode,
};


const edgeTypes: EdgeTypes = {};

function OrganizationChart({
  positions,
  accountId,
  canManagePositions,
}: {
  positions: PositionWithRelations[];
  accountId: string;
  canManagePositions: boolean;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const buildFlowData = () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // 1. Separar nós raiz (sem parent_id) dos nós filhos
    const rootPositions = positions.filter(pos => !pos.parent_id);
    const childPositions = positions.filter(pos => pos.parent_id);
    
    // 2. Calcular níveis hierárquicos
    const getLevel = (positionId: string, visited = new Set<string>()): number => {
      if (visited.has(positionId)) return 0;
      visited.add(positionId);
      
      const position = positions.find(p => p.id === positionId);
      if (!position || !position.parent_id) return 0;
      
      return getLevel(position.parent_id, visited) + 1;
    };
    
    // 3. Agrupar posições por nível
    const positionsByLevel = new Map<number, typeof positions>();
    positions.forEach(pos => {
      const level = getLevel(pos.id);
      if (!positionsByLevel.has(level)) {
        positionsByLevel.set(level, []);
      }
      positionsByLevel.get(level)!.push(pos);
    });
    
    // 4. Criar nós com posicionamento
    const xSpacing = 300;
    const ySpacing = 200;
    
    positionsByLevel.forEach((levelPositions, level) => {
      levelPositions.forEach((pos, index) => {
        const siblingsCount = levelPositions.length;
        const xOffset = (index - (siblingsCount - 1) / 2) * xSpacing;
        const yPosition = level * ySpacing;
        
        nodes.push({
          id: pos.id,
          type: 'custom',
          position: { x: xOffset, y: yPosition },
          selected: selectedNodeId === pos.id,
          data: {
            ...pos,
            position: pos,
            accountId,
            canManagePositions,
          },
        });
      });
    });
    
    // 5. Criar edges (conexões)
    childPositions.forEach(pos => {
      if (pos.parent_id && pos.parent_id !== null && pos.parent_id !== 'null') {
        const parentExists = positions.some(p => p.id === pos.parent_id);
        const parentNode = nodes.find(n => n.id === pos.parent_id);
        
        if (parentExists && parentNode) {
          const edge = {
            id: `${pos.parent_id}-${pos.id}`,
            source: pos.parent_id,
            target: pos.id,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep',
            style: {
              stroke: '#6b7280',
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: '#6b7280',
            },
          };
          edges.push(edge);
        }
      }
    });
    
    // 6. Validação final das edges
    const validEdges = edges.filter(edge => {
      const sourceExists = nodes.some(n => n.id === edge.source);
      const targetExists = nodes.some(n => n.id === edge.target);
      return sourceExists && targetExists && edge.source && edge.target;
    });
    
    return { nodes, edges: validEdges };
  };

  const { nodes, edges } = useMemo(() => buildFlowData(), [positions, accountId, canManagePositions, selectedNodeId]);

  return (
    <div className="w-full h-[calc(100vh-200px)] border rounded-lg">
      <style jsx>{`
        .react-flow__edge-path {
          stroke: #6b7280 !important;
          stroke-width: 2px !important;
          stroke-linecap: round !important;
        }
        .react-flow__edge.selected .react-flow__edge-path {
          stroke: #3b82f6 !important;
        }
        .react-flow__edge-text {
          font-size: 12px !important;
          fill: #374151 !important;
        }
        .react-flow__handle {
          opacity: 0.8 !important;
        }
        .react-flow__handle:hover {
          opacity: 1 !important;
        }
        .react-flow__node {
          pointer-events: auto !important;
        }
        .react-flow__node .pointer-events-auto {
          pointer-events: auto !important;
        }
        .react-flow__node button {
          pointer-events: auto !important;
        }
        .react-flow__node [data-radix-collection-item] {
          pointer-events: auto !important;
        }
        .react-flow__node button {
          pointer-events: auto !important;
          z-index: 10 !important;
          position: relative !important;
        }
        .react-flow__node .pointer-events-auto {
          pointer-events: auto !important;
          z-index: 10 !important;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { 
            strokeWidth: 2, 
            stroke: '#6b7280' 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: '#6b7280',
          },
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        nodesFocusable={true}
        edgesFocusable={false}
        selectNodesOnDrag={false}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        onSelectionChange={(elements) => {
          const node = elements.nodes[0];
          setSelectedNodeId(node?.id || null);
          setSelectedNode(node || null);
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={12} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable
          maskColor="rgb(240, 240, 240, 0.6)"
        />
      </ReactFlow>
      
    </div>
  );
}


