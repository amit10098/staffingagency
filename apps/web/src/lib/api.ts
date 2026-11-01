const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type ApiRole = 'SUPER_ADMIN' | 'EMPLOYER' | 'EMPLOYEE';
export type FrontendRole = 'admin' | 'employer' | 'worker';

export interface AuthUser {
  id: string;
  email: string;
  role: ApiRole;
  companyId?: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
  };
}

export function apiRoleToFrontend(role: ApiRole): FrontendRole {
  const map: Record<ApiRole, FrontendRole> = {
    SUPER_ADMIN: 'admin',
    EMPLOYER: 'employer',
    EMPLOYEE: 'worker',
  };
  return map[role];
}

export function frontendRoleToApi(role: FrontendRole): ApiRole {
  const map: Record<FrontendRole, ApiRole> = {
    admin: 'SUPER_ADMIN',
    employer: 'EMPLOYER',
    worker: 'EMPLOYEE',
  };
  return map[role];
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('accessToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
  localStorage.setItem('userRole', apiRoleToFrontend(user.role));
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('authUser');
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('userRole');
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(err.message || 'Request failed', res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<AuthUser>('/users/me'),

  getCompanies: () => request<any[]>('/companies'),

  createCompany: (data: any) =>
    request('/companies', { method: 'POST', body: JSON.stringify(data) }),

  getWorkers: () => request<any[]>('/users/workers'),

  publishRota: (data: {
    companyId: string;
    date: string;
    startTime: string;
    endTime: string;
    workerIds: string[];
    breakTime?: number;
    notes?: string;
    location?: string;
    title?: string;
  }) => request('/shifts/rota', { method: 'POST', body: JSON.stringify(data) }),

  getShifts: () => request<any[]>('/shifts'),

  getShiftsByCompany: (companyId: string) =>
    request<any[]>(`/shifts?companyId=${companyId}`),

  updateShift: (id: string, data: { startTime?: string; endTime?: string; notes?: string; breakTime?: number; status?: string }) =>
    request(`/shifts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteShift: (id: string) =>
    request(`/shifts/${id}`, { method: 'DELETE' }),

  assignWorker: (shiftId: string, workerId: string) =>
    request(`/shifts/${shiftId}/assign`, { method: 'PUT', body: JSON.stringify({ workerId }) }),

  getMyShifts: () => request<any[]>('/shifts/me'),

  getJobs: () => request<any[]>('/jobs'),

  createJob: (data: {
    title: string;
    description?: string;
    payRate: number;
    sector?: string;
    location?: string;
    type?: string;
  }) => request<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  updateJob: (id: string | number, data: {
    title?: string;
    description?: string;
    payRate?: number;
    sector?: string;
    location?: string;
    type?: string;
  }) => request<any>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteJob: (id: string | number) =>
    request<void>(`/jobs/${id}`, { method: 'DELETE' }),

  getMyJobs: () => request<any[]>('/jobs/me'),

  getNotifications: () => request<any[]>('/notifications/me'),

  markNotificationRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllNotificationsRead: () =>
    request('/notifications/read-all', { method: 'PATCH' }),

  // ─── Attendance Approval ─────────────────────────────────────────────────────

  getAttendance: (companyId?: string) =>
    request<any[]>('/shifts/attendance' + (companyId ? `?companyId=${companyId}` : '')),

  approveAttendance: (id: string) =>
    request(`/shifts/attendance/${id}/approve`, { method: 'PATCH' }),

  flagAttendance: (id: string) =>
    request(`/shifts/attendance/${id}/flag`, { method: 'PATCH' }),

  updateAttendanceTimes: (id: string, data: { clockInTime?: string; clockOutTime?: string }) =>
    request(`/shifts/attendance/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // ─── Company Management ──────────────────────────────────────────────────────

  deleteCompany: (id: string) =>
    request(`/companies/${id}`, { method: 'DELETE' }),

  updateCompany: (id: string, data: any) =>
    request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getMyPayslips: () => request<any[]>('/payroll/me'),

  getPayslips: (workerId?: string) =>
    request<any[]>(`/payroll/payslips${workerId ? `?workerId=${workerId}` : ''}`),

  uploadPayslip: (formData: FormData) =>
    request('/payroll/upload', { method: 'POST', body: formData }),

  getMyDocuments: () => request<any[]>('/documents/me'),

  getDocuments: (profileId?: string) =>
    request<any[]>(`/documents${profileId ? `?profileId=${profileId}` : ''}`),

  uploadDocument: (formData: FormData) =>
    request('/documents/upload', { method: 'POST', body: formData }),

  verifyDocument: (id: string, status: 'APPROVED' | 'REJECTED') =>
    request(`/documents/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  downloadUrl: (path: string) => {
    const token = getToken();
    return `${API_URL}${path}?token=${token}`;
  },

  downloadFile: async (path: string, filename: string) => {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError('Download failed', res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};
