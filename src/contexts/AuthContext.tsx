import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export type AccountType = "particulier" | "freelance" | "entreprise";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  accountType: AccountType;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  siret?: string;
  kycLevel: number;
  createdAt: Date;
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, accountType: AccountType, profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("firebase_uid", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setUserProfile({
          uid: data.firebase_uid,
          email: data.email,
          displayName: data.display_name,
          accountType: data.account_type as AccountType,
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          phone: data.phone || undefined,
          companyName: data.company_name || undefined,
          siret: data.siret || undefined,
          kycLevel: data.kyc_level,
          createdAt: new Date(data.created_at),
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const ensureProfile = async (supabaseUser: any) => {
    const userId = supabaseUser.id;
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("firebase_uid", userId)
      .maybeSingle();

    if (!existing) {
      const meta = supabaseUser.user_metadata || {};
      const email = supabaseUser.email || "";
      const displayName = meta.full_name || meta.name || email.split("@")[0];
      const firstName = meta.first_name || displayName?.split(" ")[0] || null;
      const lastName = meta.last_name || displayName?.split(" ").slice(1).join(" ") || null;

      await supabase.from("profiles").insert({
        firebase_uid: userId,
        email,
        display_name: displayName,
        first_name: firstName,
        last_name: lastName,
        phone: meta.phone || null,
        account_type: "particulier",
        kyc_level: 0,
      });

      // Create wallet for new user
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", userId)
        .maybeSingle();

      if (profile) {
        await supabase.from("wallets").insert({
          profile_id: profile.id,
          wallet_id: `GK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          currency: "XOF",
          balance: 0,
          max_balance: 100000,
        });
      }
    }

    await fetchUserProfile(userId);
  };

  useEffect(() => {
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(
      async (_event: string, currentSession: any) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(() => ensureProfile(currentSession.user), 0);
        } else {
          setUserProfile(null);
        }
        setIsLoading(false);
      }
    );

    (supabase.auth as any).getSession().then(({ data: { session: currentSession } }: any) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        ensureProfile(currentSession.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (
    email: string,
    password: string,
    accountType: AccountType,
    profileData: Partial<UserProfile>
  ) => {
    const displayName = profileData.firstName && profileData.lastName
      ? `${profileData.firstName} ${profileData.lastName}`
      : profileData.companyName || email.split("@")[0];

    const { data, error } = await (supabase.auth as any).signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          first_name: profileData.firstName || null,
          last_name: profileData.lastName || null,
          phone: profileData.phone || null,
        },
      },
    });
    if (error) throw error;

    if (data?.user) {
      await supabase.from("profiles").insert({
        firebase_uid: data.user.id,
        email,
        display_name: displayName,
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        phone: profileData.phone || null,
        account_type: accountType,
        kyc_level: 0,
      });

      // Create wallet
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", data.user.id)
        .maybeSingle();

      if (profile) {
        await supabase.from("wallets").insert({
          profile_id: profile.id,
          wallet_id: `GK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          currency: "XOF",
          balance: 0,
          max_balance: 100000,
        });
      }
    }
  };

  const logout = async () => {
    await (supabase.auth as any).signOut();
    setUserProfile(null);
  };

  const loginWithGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) throw error;
  };

  const loginWithApple = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await (supabase.auth as any).resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const value = {
    user,
    session,
    userProfile,
    isLoading,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithApple,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
