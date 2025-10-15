'use client';

import { useTransition } from 'react';

import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput from 'react-text-mask';

import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { toast } from '@kit/ui/sonner';
import { Trans } from '@kit/ui/trans';

import { TeamNameFormSchema } from '../../schema/update-team-name.schema';
import { updateTeamAccountName } from '../../server/actions/team-details-server-actions';

// Função para aplicar máscara no CNPJ
const formatCNPJ = (cnpj: string) => {
  if (!cnpj) return '';
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  // Aplica máscara: 12.345.678/0001-90
  return cleanCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const UpdateTeamAccountForm = (props: {
  account: {
    name: string;
    slug: string;
    cnpj: string;
    branch: string;
  };

  path: string;
}) => {
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation('teams');

  const form = useForm({
    resolver: zodResolver(TeamNameFormSchema),
    defaultValues: {
      name: props.account.name,
      cnpj: formatCNPJ(props.account.cnpj),
      branch: String(props.account.branch),
    },
  });

  return (
    <div className={'space-y-8'}>
      <Form {...form}>
        <form
          data-test={'update-team-account-name-form'}
          className={'flex flex-col space-y-4'}
          onSubmit={form.handleSubmit((data) => {
            startTransition(async () => {
              const toastId = toast.loading(t('updateTeamLoadingMessage'));

              try {
                const result = await updateTeamAccountName({
                  slug: props.account.slug,
                  name: data.name,
                  cnpj: data.cnpj,
                  branch: parseInt(data.branch, 10),
                  path: props.path,
                });

                if (result.success) {
                  toast.success(t('updateTeamSuccessMessage'), {
                    id: toastId,
                  });
                } else {
                  toast.error(t('updateTeamErrorMessage'), {
                    id: toastId,
                  });
                }
              } catch (error) {
                if (!isRedirectError(error)) {
                  toast.error(t('updateTeamErrorMessage'), {
                    id: toastId,
                  });
                } else {
                  toast.success(t('updateTeamSuccessMessage'), {
                    id: toastId,
                  });
                }
              }
            });
          })}
        >
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <FormField
              name={'name'}
              render={({ field }) => {
                return (
                  <FormItem className="flex-grow">
                    <FormLabel>
                      <Trans i18nKey={'teams:teamNameInputLabel'} />
                    </FormLabel>

                    <FormControl>
                      <Input
                        data-test={'team-name-input'}
                        required
                        placeholder={''}
                        className={'w-full'}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name={'cnpj'}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <Trans i18nKey={'teams:cnpjInputLabel'} defaults="CNPJ" />
                    </FormLabel>

                    <FormControl>
                      <MaskedInput
                        mask={[
                          /\d/,
                          /\d/,
                          '.',
                          /\d/,
                          /\d/,
                          /\d/,
                          '.',
                          /\d/,
                          /\d/,
                          /\d/,
                          '/',
                          /\d/,
                          /\d/,
                          /\d/,
                          /\d/,
                          '-',
                          /\d/,
                          /\d/,
                        ]}
                        {...field}
                        render={(ref, props) => (
                          <Input
                            data-test={'cnpj-input'}
                            required
                            placeholder={''}
                            ref={ref}
                            {...props}
                          />
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name={'branch'}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      <Trans
                        i18nKey={'teams:branchInputLabel'}
                        defaults="Filial"
                      />
                    </FormLabel>

                    <FormControl>
                      <Input
                        data-test={'branch-input'}
                        required
                        type={'number'}
                        placeholder={''}
                        className={'w-20'}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div>
            <Button
              className={'w-full md:w-auto'}
              data-test={'update-team-submit-button'}
              disabled={pending}
            >
              <Trans i18nKey={'teams:updateTeamSubmitLabel'} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
