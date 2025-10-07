'use server';

import { revalidatePath } from 'next/cache';
import { getLogger } from '@kit/shared/logger';
import { enhanceAction } from '@kit/next/actions';
import { z } from 'zod';

import { CreateEmployeeSchema, UpdateEmployeeSchema, Employee } from '../schema/employee.schema';

// Simula operações CRUD com dados mockados
let mockEmployees: Employee[] = [
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

export const createEmployeeAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'createEmployee', userId: user.id };

    try {
      logger.info(ctx, 'Creating new employee');

      // Simula validação de email único
      const existingEmployee = mockEmployees.find(emp => emp.email === data.email);
      if (existingEmployee) {
        throw new Error('Email já está em uso por outro funcionário');
      }

      // Cria novo funcionário
      const newEmployee: Employee = {
        id: (mockEmployees.length + 1).toString(),
        ...data,
        status: data.status || 'active',
      };

      mockEmployees.push(newEmployee);

      logger.info(ctx, 'Employee created successfully', { employeeId: newEmployee.id });

      revalidatePath('/home/[account]/employees', 'page');

      return {
        success: true,
        data: newEmployee,
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to create employee');
      throw error;
    }
  },
  {
    auth: true,
    schema: CreateEmployeeSchema,
  },
);

export const updateEmployeeAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'updateEmployee', userId: user.id };

    try {
      logger.info(ctx, 'Updating employee', { employeeId: data.id });

      const employeeIndex = mockEmployees.findIndex(emp => emp.id === data.id);
      if (employeeIndex === -1) {
        throw new Error('Funcionário não encontrado');
      }

      // Simula validação de email único (exceto para o próprio funcionário)
      if (data.email) {
        const existingEmployee = mockEmployees.find(emp => emp.email === data.email && emp.id !== data.id);
        if (existingEmployee) {
          throw new Error('Email já está em uso por outro funcionário');
        }
      }

      // Atualiza funcionário
      mockEmployees[employeeIndex] = {
        ...mockEmployees[employeeIndex],
        ...data,
      };

      logger.info(ctx, 'Employee updated successfully', { employeeId: data.id });

      revalidatePath('/home/[account]/employees', 'page');

      return {
        success: true,
        data: mockEmployees[employeeIndex],
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to update employee');
      throw error;
    }
  },
  {
    auth: true,
    schema: UpdateEmployeeSchema.extend({ id: z.string() }),
  },
);

export const deleteEmployeeAction = enhanceAction(
  async function (data, user) {
    const logger = await getLogger();
    const ctx = { name: 'deleteEmployee', userId: user.id };

    try {
      logger.info(ctx, 'Deleting employee', { employeeId: data.id });

      const employeeIndex = mockEmployees.findIndex(emp => emp.id === data.id);
      if (employeeIndex === -1) {
        throw new Error('Funcionário não encontrado');
      }

      mockEmployees.splice(employeeIndex, 1);

      logger.info(ctx, 'Employee deleted successfully', { employeeId: data.id });

      revalidatePath('/home/[account]/employees', 'page');

      return {
        success: true,
      };
    } catch (error) {
      logger.error({ ...ctx, error }, 'Failed to delete employee');
      throw error;
    }
  },
  {
    auth: true,
    schema: z.object({ id: z.string() }),
  },
);
