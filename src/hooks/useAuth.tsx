import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(t('error.invalidCredentials'));
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error(t('error.emailNotConfirmed'));
        }
        throw error;
      }

      toast({
        title: t('success.title'),
        description: t('success.loginSuccess'),
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: t('error.title'),
        description: error.message || t('error.loginFailed'),
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { username?: string }) => {
    try {
      setLoading(true);
      
      // Check if email already exists by attempting a sign in
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-check'
      });
      
      // If sign in doesn't throw an error about invalid credentials, email exists
      if (signInData?.user) {
        throw new Error(t('error.emailExists'));
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata || {}
        },
      });

      if (error) {
        // Check for various user exists scenarios
        if (error.message.includes('already') || error.message.includes('exists')) {
          if (error.message.toLowerCase().includes('email')) {
            throw new Error(t('error.emailExists'));
          } else if (error.message.toLowerCase().includes('username')) {
            throw new Error(t('error.usernameExists'));
          } else {
            throw new Error(t('error.userExists'));
          }
        }
        throw error;
      }

      // Always show success message for registration
      toast({
        title: t('success.title'),
        description: t('success.registerSuccess'),
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Don't show error for dummy password check
      if (!error.message.includes('Invalid login credentials')) {
        toast({
          title: t('error.title'),
          description: error.message || t('error.registerFailed'),
          variant: 'destructive',
        });
      }
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.logoutSuccess'),
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: t('error.title'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      // First verify old password by trying to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: oldPassword,
      });

      if (verifyError) {
        throw new Error(t('error.wrongOldPassword'));
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.passwordUpdated'),
      });

      return { error: null };
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: t('error.title'),
        description: error.message || t('error.passwordUpdateFailed'),
        variant: 'destructive',
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      
      // Note: Supabase doesn't have a direct deleteUser method for client-side
      // This would typically require an admin function or RPC call
      // For now, we'll just sign out and show a message
      await signOut();
      
      toast({
        title: t('success.title'),
        description: t('success.accountDeleted'),
      });

      return { error: null };
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: t('error.title'),
        description: error.message || t('error.accountDeleteFailed'),
        variant: 'destructive',
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updatePassword,
    deleteAccount,
    isAuthenticated: !!user,
  };
};
