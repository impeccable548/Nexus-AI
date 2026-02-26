import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Fetch user profile with retry logic
  // Retries up to 3 times with a 500ms delay to handle RLS timing race conditions
  const fetchProfile = async (userId, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setIsAdmin(data?.is_admin || false);
          console.log('✅ Profile loaded:', data);
          console.log('🔐 Admin status:', data?.is_admin);
          return data; // success - exit
        }
      } catch (error) {
        console.warn(`⚠️ Profile fetch attempt ${attempt} failed:`, error.message);

        if (attempt < retries) {
          // Wait 500ms before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          console.error('❌ All profile fetch attempts failed');
          setProfile(null);
          setIsAdmin(false);
        }
      }
    }
  };

  // Build an immediate profile from user metadata
  // This ensures full_name shows instantly while fetchProfile runs in background
  const buildOptimisticProfile = (authUser) => {
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      is_admin: false, // will be overwritten once fetchProfile resolves
    };
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Set optimistic profile immediately so name shows right away
          setProfile(buildOptimisticProfile(session.user));
          // Then fetch real profile from DB in background
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Set optimistic profile immediately from metadata
          setProfile(buildOptimisticProfile(session.user));

          // On signup the trigger needs a moment to run before we can fetch
          const delay = event === 'SIGNED_IN' ? 800 : 0;

          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, delay);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up with email/password
  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      console.log('✅ Signup successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign in with email/password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Login successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);

      console.log('✅ Logged out');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh profile manually (useful after profile updates)
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    user,
    profile,
    session,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
