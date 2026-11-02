export interface BannerItem {
  id?: number;
  title?: string;
  image?: string;
  platform?: string;
  heading?: string;
  type?: string;
  isPubliced?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// supports WebBanner → WellcomeBanner → [BannerItem]
export interface BannerGroupLevel2 {
  [key: string]: BannerItem[];
}

// supports WebBanner → (Level2 groups)
export interface BannerGroup {
  [key: string]: BannerGroupLevel2;
}

export interface BannerResponse {
  count?: number;
  data?: BannerGroup;
  [key: string]: any;
}
