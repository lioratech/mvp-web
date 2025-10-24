import { getSupabaseServerClient } from '@kit/supabase/server-client';

type ValidationResult = {
  success: boolean;
  error?: string;
  account?: {
    id: string;
    slug: string | null;
    name: string;
  };
};

export async function validateAccountAccess(
  userId: string,
  accountId: string,
): Promise<ValidationResult> {
  try {
    const supabase = getSupabaseServerClient();

    const { data: account, error } = await supabase
      .from('accounts')
      .select('id, slug, name')
      .eq('id', accountId)
      .single();

    if (error || !account) {
      return {
        success: false,
        error: 'Account not found or access denied',
      };
    }

    return {
      success: true,
      account,
    };
  } catch {
    return {
      success: false,
      error: 'Internal error validating account access',
    };
  }
}

export async function validateAccountAccessBySlug(
  userId: string,
  accountSlug: string,
): Promise<ValidationResult> {
  try {
    const supabase = getSupabaseServerClient();

    const { data: account, error } = await supabase
      .from('accounts')
      .select('id, slug, name')
      .eq('slug', accountSlug)
      .single();

    if (error || !account) {
      return {
        success: false,
        error: 'Account not found',
      };
    }

    return validateAccountAccess(userId, account.id);
  } catch {
    return {
      success: false,
      error: 'Internal error validating account access',
    };
  }
}

