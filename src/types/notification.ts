export interface NotificationItem {
  id?: number;
  title?: string;
  body?: string;
  type?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface NotificationGroup {
  [key: string]: NotificationItem[]; // dynamic category keys: Alert, Info, etc.
}

export interface NotificationResponse {
  data?: NotificationGroup;
  pagination?: {
    total?: number;
    limit?: number;
    currentPage?: number;
    totalPage?: number;
    [key: string]: any;
  };
}
