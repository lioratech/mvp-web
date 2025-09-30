'use client';

import { useState, useEffect } from 'react';

import { SignInMethodsContainer } from '@kit/auth/sign-in';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kit/ui/card';
import { Alert, AlertDescription } from '@kit/ui/alert';
import { Heading } from '@kit/ui/heading';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@kit/ui/input-otp';
import { Trans } from '@kit/ui/trans';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';

interface SignInPageProps {
  searchParams: Promise<{
    invite_token?: string;
    next?: string;
  }>;
}

const CORRECT_OTP = '202525';

function SignInPage({ searchParams }: SignInPageProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | undefined>();
  const [next, setNext] = useState<string | undefined>();

  // Inicializar os parâmetros da URL
  useEffect(() => {
    searchParams.then(({ invite_token, next: nextParam }) => {
      setInviteToken(invite_token);
      setNext(nextParam);
    });
  }, [searchParams]);

  const paths = {
    callback: pathsConfig.auth.callback,
    returnPath: next || pathsConfig.app.home,
    joinTeam: pathsConfig.app.joinTeam,
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Por favor, insira o código completo de 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simular verificação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === CORRECT_OTP) {
      setIsOTPVerified(true);
    } else {
      setError('Código OTP incorreto. Tente novamente.');
      setOtp('');
    }

    setIsVerifying(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerify();
    }
  };

  return (
    <>
    {isOTPVerified && (
      <div className={'flex flex-col items-center gap-1'}>
        <Heading level={4} className={'tracking-tight'}>
          <Trans i18nKey={'auth:signInHeading'} />
        </Heading>

        <p className={'text-muted-foreground text-sm'}>
          <Trans i18nKey={'auth:signInSubheading'} />
        </p>
      </div>
      )}

      {!isOTPVerified ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>
              Acesso Restrito
            </CardTitle>
            <CardDescription>
              <Trans 
                i18nKey="auth:otpDescription" 
                defaults="Digite o código de verificação para continuar" 
              />
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                onKeyDown={handleKeyPress}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full"
            >
              {isVerifying ? (
                <Trans i18nKey="auth:verifying" defaults="Verificando..." />
              ) : (
                <Trans i18nKey="auth:verify" defaults="Verificar" />
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Ou envie um email para contato@lioratech.com.br
            </div>
          </CardContent>
        </Card>
      ) : (
        <SignInMethodsContainer
          inviteToken={inviteToken}
          paths={paths}
          providers={authConfig.providers}
        />
      )}
    </>
  );
}

export default SignInPage;
