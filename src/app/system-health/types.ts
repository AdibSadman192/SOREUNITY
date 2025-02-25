export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  activeUsers: number;
  responseTime: number;
}

export interface SystemAlert {
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

export interface RecoveryStatus {
  success: boolean;
  message: string;
  timestamp: Date;
  actionType: string;
}