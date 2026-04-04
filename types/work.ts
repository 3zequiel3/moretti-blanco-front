export interface ImageData {
  url: string;
  nombre?: string;
}

export interface IWork {
  id: number;
  titulo: string;
  descripcion: string;
  imagenes: ImageData[];
  comentarios?: string;
  is_active: boolean;
  puntuacion: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkData {
  titulo: string;
  descripcion: string;
  imagenes: File[];
  comentarios?: string;
}

export interface UpdateWorkData {
  titulo?: string;
  descripcion?: string;
  comentarios?: string;
  imagenes?: File[];
}

export interface RateWorkData {
  trabajo_id: number;
  puntuacion: number;
}
