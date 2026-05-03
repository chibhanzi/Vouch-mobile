import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export type NotifType = "already_used" | "fraud";

export type AppNotification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: number;
};

interface NotificationContextType {
  notifications: AppNotification[];
  notify: (type: NotifType, title: string, body: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notify: () => {},
  dismiss: () => {},
});

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const counter = useRef(0);

  const notify = useCallback(
    (type: NotifType, title: string, body: string) => {
      const id = `n-${Date.now()}-${counter.current++}`;
      const notif: AppNotification = {
        id,
        type,
        title,
        body,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 3));
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
