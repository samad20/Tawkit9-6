export type ContentType = 'ayat' | 'hadith' | 'azkar';

export interface ContentItem {
  text: string;
  reference?: string;
  type: ContentType;
}

export interface Message {
  enabled: boolean;
  schedule: string; // 'DAILY', 'JOMOA', 'MM/DD'
  text: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface City {
  code: string;
  name: string;
  countryCode: string;
}
