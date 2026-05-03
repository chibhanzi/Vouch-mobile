import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "organizer" | "validator";

export interface User {
  role: UserRole;
  email: string;
  name: string;
  validatorCode?: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  ticketsSold: number;
  ticketsValidated: number;
  status: "upcoming" | "active" | "completed";
}

export interface Validator {
  id: string;
  name: string;
  email: string;
  code: string;
  active: boolean;
  scansToday: number;
  lastSeen: string;
}

export interface ScanRecord {
  id: string;
  ticketId: string;
  holderName: string;
  eventName: string;
  timestamp: string;
  status: "valid" | "invalid" | "already_used";
  gate: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  events: Event[];
  validators: Validator[];
  scanHistory: ScanRecord[];
  login: (params: {
    email: string;
    password: string;
    role: UserRole;
    validatorCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addScan: (record: Omit<ScanRecord, "id" | "timestamp">) => void;
  toggleValidator: (id: string) => void;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "evt1",
    name: "TechConf 2026",
    date: "2026-05-15",
    venue: "Convention Center, Hall A",
    ticketsSold: 500,
    ticketsValidated: 342,
    status: "active",
  },
  {
    id: "evt2",
    name: "Music Festival",
    date: "2026-06-20",
    venue: "City Park Main Stage",
    ticketsSold: 2000,
    ticketsValidated: 0,
    status: "upcoming",
  },
  {
    id: "evt3",
    name: "Business Summit",
    date: "2026-04-28",
    venue: "Hotel Grand Ballroom",
    ticketsSold: 300,
    ticketsValidated: 298,
    status: "completed",
  },
  {
    id: "evt4",
    name: "Art Exhibition",
    date: "2026-07-10",
    venue: "City Gallery",
    ticketsSold: 150,
    ticketsValidated: 0,
    status: "upcoming",
  },
];

const MOCK_VALIDATORS: Validator[] = [
  {
    id: "val1",
    name: "Alex Chen",
    email: "alex@event.com",
    code: "VAL001",
    active: true,
    scansToday: 89,
    lastSeen: "2 min ago",
  },
  {
    id: "val2",
    name: "Maria Garcia",
    email: "maria@event.com",
    code: "VAL002",
    active: true,
    scansToday: 134,
    lastSeen: "5 min ago",
  },
  {
    id: "val3",
    name: "James Wilson",
    email: "james@event.com",
    code: "VAL003",
    active: false,
    scansToday: 0,
    lastSeen: "2 hours ago",
  },
  {
    id: "val4",
    name: "Sarah Kim",
    email: "sarah@event.com",
    code: "VAL004",
    active: true,
    scansToday: 67,
    lastSeen: "1 min ago",
  },
];

const MOCK_SCAN_HISTORY: ScanRecord[] = [
  {
    id: "s1",
    ticketId: "TKT-8821",
    holderName: "David Park",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    status: "valid",
    gate: "Gate A",
  },
  {
    id: "s2",
    ticketId: "TKT-4432",
    holderName: "Emma Johnson",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    status: "valid",
    gate: "Gate A",
  },
  {
    id: "s3",
    ticketId: "TKT-9901",
    holderName: "Unknown",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    status: "invalid",
    gate: "Gate A",
  },
  {
    id: "s4",
    ticketId: "TKT-3310",
    holderName: "Lily Zhang",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    status: "already_used",
    gate: "Gate B",
  },
  {
    id: "s5",
    ticketId: "TKT-7724",
    holderName: "Carlos Rivera",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    status: "valid",
    gate: "Gate A",
  },
  {
    id: "s6",
    ticketId: "TKT-5519",
    holderName: "Priya Sharma",
    eventName: "TechConf 2026",
    timestamp: new Date(Date.now() - 48 * 60000).toISOString(),
    status: "valid",
    gate: "Gate C",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "@vouch_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events] = useState<Event[]>(MOCK_EVENTS);
  const [validators, setValidators] = useState<Validator[]>(MOCK_VALIDATORS);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>(MOCK_SCAN_HISTORY);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((val) => {
      if (val) {
        try {
          setUser(JSON.parse(val));
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (params: {
    email: string;
    password: string;
    role: UserRole;
    validatorCode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const { email, password, role, validatorCode } = params;

    if (password !== "password") {
      return { success: false, error: "Invalid credentials" };
    }

    if (role === "organizer") {
      if (email !== "organizer@event.com") {
        return { success: false, error: "Invalid organizer email" };
      }
      const u: User = { role: "organizer", email, name: "Event Organizer" };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(u));
      setUser(u);
      return { success: true };
    } else {
      if (email !== "validator@event.com") {
        return { success: false, error: "Invalid validator email" };
      }
      if (validatorCode !== "VAL001" && validatorCode !== "VAL002" && validatorCode !== "VAL004") {
        return { success: false, error: "Invalid validator code" };
      }
      const validator = MOCK_VALIDATORS.find((v) => v.code === validatorCode);
      const u: User = {
        role: "validator",
        email,
        name: validator?.name ?? "Validator",
        validatorCode,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(u));
      setUser(u);
      return { success: true };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const addScan = (record: Omit<ScanRecord, "id" | "timestamp">) => {
    const newRecord: ScanRecord = {
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      timestamp: new Date().toISOString(),
    };
    setScanHistory((prev) => [newRecord, ...prev]);
  };

  const toggleValidator = (id: string) => {
    setValidators((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        events,
        validators,
        scanHistory,
        login,
        logout,
        addScan,
        toggleValidator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
