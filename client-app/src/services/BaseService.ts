import { QueryOptions } from '@doer/entities';

const defaultOptions: QueryOptions = {};

export default class BaseService {
  base = 'http://127.0.0.1:5000';

  api = '/api';

  publicApi = '/public-api';

  request(url: string, opts?: RequestInit): Promise<Response> {
    return fetch(url, opts);
  }

  get<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { query } = opts;
    return this.request(this.url(url) + this.query(query), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    }).then((res) => res.json());
  }

  post<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { params, query } = opts;
    return this.request(this.url(url) + this.query(query), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: this.body(params),
    }).then((res) => res.json());
  }

  publicGet<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { query } = opts;
    return this.request(this.publicUrl(url) + this.query(query), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    }).then((res) => res.json());
  }

  publicPost<T>(url: string, opts: QueryOptions = defaultOptions): Promise<T> {
    const { params, query } = opts;
    return this.request(this.publicUrl(url) + this.query(query), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: this.body(params),
    }).then((res) => res.json());
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

  url(url: string) {
    return `${this.base}${this.api}${url}`;
  }

  publicUrl(url: string) {
    return `${this.base}${this.publicApi}${url}`;
  }
}
