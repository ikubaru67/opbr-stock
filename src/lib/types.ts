export interface AccountData {
  code: string;
  server: string;
  characters: string[];
  diamonds: number;
  fragments: number;
  price: number;
  source: string;
  status: string;
  os?: string;
  loginVia?: string;
}

export interface ShokanAccount {
  code: string;
  roles: string;
  autoPrice: number;
  manualPrice: number;
  aa: number | null;
  bb: number | null;
  cc: number | null;
  dd: number | null;
  ee: number | null;
}

export interface ShokanResponse {
  message: string | null;
  statusCode: number;
  valid: boolean;
  content: ShokanAccount[];
  pages: number;
  pageNum: number;
}

export interface OpbrAccount {
  account_name: string;
  characters: string;
  fragments: number;
  diamonds: number;
  server: string;
  source_mark: string;
  calculatedPrice?: number;
}
