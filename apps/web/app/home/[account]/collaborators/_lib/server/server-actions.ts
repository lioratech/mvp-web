'use server';

import { revalidatePath } from 'next/cache';
import { getLogger } from '@kit/shared/logger';
import { enhanceAction } from '@kit/next/actions';
import { z } from 'zod';

import { CreateCollaboratorSchema, UpdateCollaboratorSchema, Collaborator } from '../schema/collaborator.schema';

// Simula operações CRUD com dados mockados
const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    position: 'Desenvolvedora Senior',
    department: 'Tecnologia',
    phone: '(11) 99999-1111',
    hireDate: '2022-01-15',
    birthDate: '1990-05-20',
    salary: 8500,
    gender: 'female',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@empresa.com',
    position: 'Gerente de Vendas',
    department: 'Vendas',
    phone: '(11) 99999-2222',
    hireDate: '2021-03-20',
    salary: 12000,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@empresa.com',
    position: 'Designer UX/UI',
    department: 'Design',
    phone: '(11) 99999-3333',
    hireDate: '2022-06-10',
    salary: 7500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'João Costa',
    email: 'joao.costa@empresa.com',
    position: 'Analista Financeiro',
    department: 'Financeiro',
    phone: '(11) 99999-4444',
    hireDate: '2021-11-05',
    salary: 6800,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@empresa.com',
    position: 'Coordenadora de RH',
    department: 'Recursos Humanos',
    phone: '(11) 99999-5555',
    hireDate: '2020-08-12',
    salary: 9200,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '6',
    name: 'Roberto Alves',
    email: 'roberto.alves@empresa.com',
    position: 'Desenvolvedor Pleno',
    department: 'Tecnologia',
    phone: '(11) 99999-6666',
    hireDate: '2023-02-28',
    salary: 6500,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '7',
    name: 'Patricia Souza',
    email: 'patricia.souza@empresa.com',
    position: 'Assistente Administrativo',
    department: 'Administrativo',
    phone: '(11) 99999-7777',
    hireDate: '2022-09-15',
    salary: 4200,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '8',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@empresa.com',
    position: 'Analista de Marketing',
    department: 'Marketing',
    phone: '(11) 99999-8888',
    hireDate: '2023-01-10',
    salary: 5800,
    status: 'on_leave',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '9',
    name: 'Camila Rodrigues',
    email: 'camila.rodrigues@empresa.com',
    position: 'Contadora',
    department: 'Financeiro',
    phone: '(11) 99999-9999',
    hireDate: '2021-05-22',
    salary: 7800,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '10',
    name: 'Diego Martins',
    email: 'diego.martins@empresa.com',
    position: 'Especialista em Vendas',
    department: 'Vendas',
    phone: '(11) 99999-0000',
    hireDate: '2022-12-01',
    salary: 9500,
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
  },
];

export const createCollaboratorAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'createCollaborator', userId: user.id };

    try {
      logger.info(ctx, 'Creating new collaborator');

      // Simula validação de email único
      const existingCollaborator = mockCollaborators.find(emp => emp.email === data.email);
      if (existingCollaborator) {
        throw new Error('Email já está em uso por outro colaborador');
      }

      // Cria novo colaborador
      const newCollaborator: Collaborator = {
        id: (mockCollaborators.length + 1).toString(),
        ...data,
        status: data.status || 'active',
      };

      mockCollaborators.push(newCollaborator);

      logger.info(ctx, 'Collaborator created successfully', { collaboratorId: newCollaborator.id });

      revalidatePath('/home/[account]/collaborators', 'page');

      return {
        success: true,
        data: newCollaborator,
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to create collaborator');
      throw error;
    }
  },
  {
    auth: true,
    schema: CreateCollaboratorSchema,
  },
);

export const updateCollaboratorAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'updateCollaborator', userId: user.id };

    try {
      logger.info(ctx, 'Updating collaborator', { collaboratorId: data.id });

      const collaboratorIndex = mockCollaborators.findIndex(emp => emp.id === data.id);
      if (collaboratorIndex === -1) {
        throw new Error('Colaborador não encontrado');
      }

      // Simula validação de email único (exceto para o próprio colaborador)
      if (data.email) {
        const existingCollaborator = mockCollaborators.find(emp => emp.email === data.email && emp.id !== data.id);
        if (existingCollaborator) {
          throw new Error('Email já está em uso por outro colaborador');
        }
      }

      // Atualiza colaborador
      const updatedCollaborator = {
        ...mockCollaborators[collaboratorIndex],
        ...data,
      };
      mockCollaborators[collaboratorIndex] = updatedCollaborator as Collaborator;

      logger.info(ctx, 'Collaborator updated successfully', { collaboratorId: data.id });

      revalidatePath('/home/[account]/collaborators', 'page');

      return {
        success: true,
        data: mockCollaborators[collaboratorIndex],
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to update collaborator');
      throw error;
    }
  },
  {
    auth: true,
    schema: UpdateCollaboratorSchema.extend({ id: z.string() }),
  },
);

export const deleteCollaboratorAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'deleteCollaborator', userId: user.id };

    try {
      logger.info(ctx, 'Deleting collaborator', { collaboratorId: data.id });

      const collaboratorIndex = mockCollaborators.findIndex(emp => emp.id === data.id);
      if (collaboratorIndex === -1) {
        throw new Error('Colaborador não encontrado');
      }

      mockCollaborators.splice(collaboratorIndex, 1);

      logger.info(ctx, 'Collaborator deleted successfully', { collaboratorId: data.id });

      revalidatePath('/home/[account]/collaborators', 'page');

      return {
        success: true,
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to delete collaborator');
      throw error;
    }
  },
  {
    auth: true,
    schema: z.object({ id: z.string() }),
  },
);
