import { createHmac, timingSafeEqual } from 'crypto';
import { DropdownState } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod, HttpMessageBody, QueryParams } from '@activepieces/pieces-common';

async function call<T = unknown>({ apiKey, method, path, body, query }: CallParams): Promise<T> {
  const response = await httpClient.sendRequest<HttpMessageBody>({
    method,
    url: `${BASE_URL}${path}`,
    headers: { 'x-api-key': apiKey, Accept: 'application/json', 'Content-Type': 'application/json' },
    body,
    queryParams: query,
  });
  return unwrap<T>(response.body);
}

function unwrap<T>(body: unknown): T {
  if (body !== null && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

function splitNumbers(value: string | undefined): string[] {
  return (value ?? '')
    .split(/[,;\n]/)
    .map((n) => n.trim())
    .filter((n) => n.length > 0);
}

function cleanQuery(values: Record<string, string | number | undefined | null>): QueryParams {
  return Object.fromEntries(
    Object.entries(values)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)]),
  );
}

function phpJson(compact: string): string {
  return compact
    .replace(/\//g, '\\/')
    .replace(/[\u007f-\uffff]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

function verifySignature({ rawBody, body, signature, secret }: VerifyParams): boolean {
  if (!signature || !secret) {
    return false;
  }
  const compact = JSON.stringify(body);
  const candidates = [
    typeof rawBody === 'string' || Buffer.isBuffer(rawBody) ? rawBody : undefined,
    compact,
    phpJson(compact),
  ].filter((c): c is string | Buffer => c !== undefined);
  const given = Buffer.from(signature);
  return candidates.some((payload) => {
    const expected = Buffer.from('sha256=' + createHmac('sha256', secret).update(payload).digest('hex'));
    return expected.length === given.length && timingSafeEqual(expected, given);
  });
}

async function deviceOptions(apiKey: string | undefined): Promise<DropdownState<number>> {
  if (!apiKey) {
    return { disabled: true, options: [], placeholder: 'Connect your SMS Gora account first' };
  }
  const devices = await call<Device[]>({ apiKey, method: HttpMethod.GET, path: '/devices' });
  const list = Array.isArray(devices) ? devices : [];
  if (list.length === 0) {
    return { disabled: true, options: [], placeholder: 'No phones yet: link one in the SMS Gora app' };
  }
  return {
    disabled: false,
    options: list.map((d) => ({
      label: [d.name ?? d.model ?? `Phone ${d.id}`, d.status ? `(${d.status})` : ''].join(' ').trim(),
      value: Number(d.id),
    })),
  };
}

export const BASE_URL = 'https://tekservix.com/smsgora/api/v1';

export const smsGoraApi = { call, splitNumbers, cleanQuery, verifySignature, deviceOptions };

type CallParams = {
  apiKey: string;
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: QueryParams;
};

type VerifyParams = {
  rawBody: unknown;
  body: unknown;
  signature: string | undefined;
  secret: string | undefined;
};

type Device = {
  id: number | string;
  name?: string;
  model?: string;
  status?: string;
};
