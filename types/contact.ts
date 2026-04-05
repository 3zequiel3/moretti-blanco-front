export interface IContactLinks {
  [key: string]: string;
}

export interface IContactData {
  id: number;
  nombre: string;
  cargo: string | null;
  telefono: string;
  foto_url: string | null;
  links_botones: IContactLinks;
}

export interface CreateContactData {
  nombre: string;
  cargo?: string;
  telefono: string;
  file: File;
  links_botones: IContactLinks;
}

export interface UpdateContactData {
  id: number;
  nombre?: string;
  cargo?: string;
  telefono?: string;
  links_botones?: IContactLinks;
}

export interface UpdateContactPhotoData {
  id: number;
  file: File;
}
