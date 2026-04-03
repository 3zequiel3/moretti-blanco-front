export interface IBanner {
    id: number;
    image_url: string;
    descripcion: string;
    orden: number;
    is_active: boolean;
}

export interface CreateBannerData {
    image_url: string;
    descripcion: string;
    orden: number;
}

export interface UpdateBannerData {
    id: number;
    image_url?: string;
    descripcion?: string;
    orden?: number;
    is_active?: boolean;
}


export interface DeactivateBannerData {
    id: number;
}

export interface ActivateBannerData {
    id: number;
}

export interface ISlide {
    id: number;
    image_url: string;
    descripcion: string;
}