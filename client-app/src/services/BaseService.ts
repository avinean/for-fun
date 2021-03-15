import { QueryOptions } from '@doer/entities';

const defaultOptions: QueryOptions = {};
export default class BaseService {
  base = 'http://127.0.0.1:5000';

  api = '/api';

  publicApi = '/public-api';

  request<T>(url: string, opts?: RequestInit): Promise<T> {
    return fetch(url, opts).then(this.parse);
  }

  get<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { query } = opts;
    return this.request<T>(this.url(url) + this.query(query), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.sessionToken}`,
      },
      mode: 'cors',
    });
  }

  post<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { params, query } = opts;
    return this.request<T>(this.url(url) + this.query(query), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.sessionToken}`,
      },
      mode: 'cors',
      body: this.body(params),
    });
  }

  publicGet<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { query } = opts;
    return this.request<T>(this.publicUrl(url) + this.query(query), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    });
  }

  publicPost<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { params, query } = opts;
    return this.request<T>(this.publicUrl(url) + this.query(query), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: this.body(params),
    });
  }

  body(params?: Record<string, any>): string | undefined {
    if (!params) return '';
    return JSON.stringify(params);
  }

  query(params?: Record<string, any>): string {
    if (!params) return '';
    return `?${Object.entries(params)
      .map((pair) => pair.join('='))
      .join('&')}`;
  }

  async parse(response: Response) {
    let result;
    try {
      result = await response.json();
    } catch {
      return response;
    }

    if (result.error) {
      throw { message: result.error };
    } else {
      return result;
    }
  }

  url(url: string) {
    return `${this.base}${this.api}${url}`;
  }

  publicUrl(url: string) {
    return `${this.base}${this.publicApi}${url}`;
  }
}
