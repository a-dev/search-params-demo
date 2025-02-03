import { act, render, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryRouter } from 'react-router';
import { z } from 'zod';

import { createUrlSearchParams } from './use-url-search-params';

// Test schema with various field types
const testSchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  page: z.string().default('1'),
  state: z.enum(['draft', 'active', 'done']).default('draft'),
});

type TestSchema = z.infer<typeof testSchema>;

describe('createUrlSearchParams', () => {
  const onValidationError = vi.fn();
  const beforeUpdateCallback = vi.fn((params) => params);

  const {
    URLSearchParamsProvider,
    useGetURLSearchParams,
    useUpdateURLSearchParams,
  } = createUrlSearchParams<TestSchema>({
    zodSchema: testSchema,
    onValidationError,
    beforeUpdateCallback,
  });

  const renderURLParamsHook = () => {
    return renderHook(
      () => ({
        params: useGetURLSearchParams(),
        updateParams: useUpdateURLSearchParams(),
      }),
      {
        wrapper: ({ children }) => (
          <MemoryRouter>
            <URLSearchParamsProvider>{children}</URLSearchParamsProvider>
          </MemoryRouter>
        ),
      },
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    render(
      <MemoryRouter>
        <URLSearchParamsProvider>
          <div />
        </URLSearchParamsProvider>
      </MemoryRouter>,
    );
  });

  it('should initialize with default values', () => {
    const { result } = renderURLParamsHook();

    expect(result.current.params).toEqual({
      page: '1',
      state: 'draft',
    });
  });

  it('should update single parameter', () => {
    const { result } = renderURLParamsHook();

    act(() => {
      result.current.updateParams({ search: 'test' });
    });

    expect(result.current.params.search).toBe('test');
  });

  it('should handle array parameters', () => {
    const { result } = renderURLParamsHook();

    act(() => {
      result.current.updateParams({ categories: ['cat1', 'cat2'] });
    });

    expect(result.current.params.categories).toEqual(['cat1', 'cat2']);
  });

  it('should call beforeUpdateCallback when updating params', () => {
    const { result } = renderURLParamsHook();

    act(() => {
      result.current.updateParams({ search: 'test' });
    });

    expect(beforeUpdateCallback).toHaveBeenCalledWith(
      { search: 'test' },
      expect.any(Object),
    );
  });

  it('should handle validation errors', () => {
    const invalidSchema = z.object({
      number: z.number(),
    });

    const { URLSearchParamsProvider } = createUrlSearchParams({
      zodSchema: invalidSchema,
      onValidationError,
    });

    renderHook(() => useGetURLSearchParams(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['?number=invalid']}>
          <URLSearchParamsProvider>{children}</URLSearchParamsProvider>
        </MemoryRouter>
      ),
    });

    expect(onValidationError).toHaveBeenCalled();
  });

  it('should clean only empty params', () => {
    const { result } = renderURLParamsHook();

    act(() => {
      result.current.updateParams({
        search: 'cat',
        categories: ['cat1'],
      });
    });

    expect(result.current.params).toEqual({
      page: '1',
      state: 'draft',
      categories: ['cat1'],
      search: 'cat',
    });

    act(() => {
      result.current.updateParams({
        page: '2',
      });
    });

    expect(result.current.params).toEqual({
      page: '2',
      state: 'draft',
      categories: ['cat1'],
      search: 'cat',
    });

    act(() => {
      result.current.updateParams({
        state: 'active',
        search: undefined,
        categories: undefined,
      });
    });

    expect(result.current.params).toEqual({
      page: '2',
      state: 'active',
    });
  });

  it('should not update if values are the same', () => {
    const { result } = renderURLParamsHook();

    const initialParams = { ...result.current.params };

    act(() => {
      result.current.updateParams({ search: '' });
    });

    expect(result.current.params).toEqual(initialParams);
    expect(beforeUpdateCallback).not.toHaveBeenCalled();
  });

  it('should handle multiple parameter updates', () => {
    const { result } = renderURLParamsHook();

    act(() => {
      result.current.updateParams({
        search: 'test',
        page: '2',
        categories: ['cat1'],
      });
    });

    expect(result.current.params).toEqual({
      search: 'test',
      page: '2',
      categories: ['cat1'],
      state: 'draft',
    });
  });
});
