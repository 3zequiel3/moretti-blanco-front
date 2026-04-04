export interface AdminUser {
  id: number;
  nombre: string;
  username: string;
  foto_url: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}
