import { useCallback, useLayoutEffect } from 'react';
import type { ReactNode } from 'react';

import { z } from 'zod';
import type { AnyZodObject, ZodSchema } from 'zod';

import { useSearchParams } from 'react-router';
import type { NavigateOptions } from 'react-router';

import { createContext, useContext } from 'react';

/* types */
export type BeforeUpdateCallback<Params> = (
  updatedParams: Partial<Params>,
  currentParams?: Partial<Params>,
) => Partial<Params> | undefined;

type TData = Record<string, string | string[] | undefined>;

type CreateUrlSearchProps<T extends TData> = {
  zodSchema: ZodSchema;
  beforeUpdateCallback?: BeforeUpdateCallback<T>;
  onValidationError?: (error: z.ZodError) => void;
};

/* methods */
function hasZodDefaults(schema: ZodSchema): boolean {
  if (!(schema instanceof z.ZodObject)) return false;

  for (const value of Object.values(schema.shape)) {
    if (value instanceof z.ZodDefault) return true;
  }

  return false;
}

function isArrayParam<Schema extends AnyZodObject>(
  schema: Schema,
  property: string,
): boolean {
  const propertySchema = schema.shape?.[property];
  if (propertySchema?.description === 'array') return true; // _def is a private property of zod, so this is a way to set it manually

  return propertySchema?._def.innerType instanceof z.ZodArray;
}

/* decode */
function decodeSearchParams(
  searchParams: URLSearchParams,
  zodSchema: ZodSchema,
) {
  type TDecodedParams = z.infer<typeof zodSchema>;
  const decodedParams = {} as TDecodedParams;

  for (const [key, value] of searchParams) {
    if (isArrayParam<TDecodedParams>(zodSchema, key)) {
      if (Array.isArray(decodedParams[key]) && decodedParams[key]?.length > 0) {
        decodedParams[key].push(value);
      } else {
        decodedParams[key] = [value];
      }
    } else {
      decodedParams[key] = value;
    }
  }

  return zodSchema.safeParse(decodedParams);
}

/* encode */
export function encodeSearchParams<TParamsObject>(
  params: TParamsObject,
  zodSchema: ZodSchema,
) {
  // Get the type of params from the zod schema
  type TDecodedParams = z.infer<typeof zodSchema>;

  const searchParams = new URLSearchParams();
  const { success, error, data: validatedParams } = zodSchema.safeParse(params);

  if (!success) {
    return {
      success: false,
      error,
      searchParams: {},
    };
  }

  for (const key in validatedParams) {
    const value = validatedParams[key];
    if (isArrayParam<TDecodedParams>(zodSchema, key) && Array.isArray(value)) {
      for (const v of value) searchParams.append(key, v);
    } else if (typeof value === 'string') {
      searchParams.set(key, value);
    }
  }
  return {
    success: true,
    searchParams,
  };
}

function cleanEmptyParams<T extends TData>(params: T): T {
  const cleaned = {} as TData;
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && !(Array.isArray(value) && value.length === 0)) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

/* Create provider and useContext hooks */
export function createUrlSearchParams<TParamsObject extends TData>({
  zodSchema,
  beforeUpdateCallback,
  onValidationError,
}: CreateUrlSearchProps<TParamsObject>) {
  const GetURLSearchParamsContext = createContext<TParamsObject>(
    {} as TParamsObject,
  );

  function useGetURLSearchParams() {
    return useContext(GetURLSearchParamsContext);
  }

  const UpdateURLSearchParamsContext = createContext<
    ((params: Partial<TParamsObject>) => void) | undefined
  >(undefined);

  function useUpdateURLSearchParams() {
    const context = useContext(UpdateURLSearchParamsContext);
    if (context === undefined)
      throw new Error(
        'This hook must be used within a URLSearchParamsProvider',
      );
    return context;
  }

  function URLSearchParamsProvider({ children }: { children: ReactNode }) {
    const [searchParamsFromRouter, setSearchParamsToRouter] = useSearchParams();

    const { data, error, success } = decodeSearchParams(
      searchParamsFromRouter,
      zodSchema,
    );

    if (!success) onValidationError?.(error);

    const updateURLSearchParams = useCallback(
      (values: Partial<TParamsObject>, navigateOpts?: NavigateOptions) => {
        if (
          Object.keys(values).every((key) => {
            const val = values[key] === '' ? undefined : values[key];
            return val === data[key];
          })
        )
          return;

        const newValues = beforeUpdateCallback?.(values, data) ?? values;

        const nextParams = cleanEmptyParams<TParamsObject>({
          ...data,
          ...newValues,
        });

        const { searchParams, error } = encodeSearchParams(
          nextParams,
          zodSchema,
        );

        if (error) {
          onValidationError?.(error);
          return;
        }

        setSearchParamsToRouter(searchParams, navigateOpts);
      },
      [
        beforeUpdateCallback,
        zodSchema,
        data,
        setSearchParamsToRouter,
        onValidationError,
      ],
    );

    // Set default values on mount
    useLayoutEffect(() => {
      const hasDefault = hasZodDefaults(zodSchema);
      if (hasDefault) {
        const { data, error, success } = decodeSearchParams(
          searchParamsFromRouter,
          zodSchema,
        );

        if (!success) {
          onValidationError?.(error);
          return;
        }
        setSearchParamsToRouter(data, { replace: true });
      }
    }, [zodSchema, setSearchParamsToRouter, onValidationError]);

    return (
      <GetURLSearchParamsContext.Provider value={data}>
        <UpdateURLSearchParamsContext.Provider value={updateURLSearchParams}>
          {children}
        </UpdateURLSearchParamsContext.Provider>
      </GetURLSearchParamsContext.Provider>
    );
  }

  return {
    URLSearchParamsProvider,
    useGetURLSearchParams,
    useUpdateURLSearchParams,
  };
}
