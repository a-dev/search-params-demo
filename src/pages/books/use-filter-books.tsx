import {
  type BeforeUpdateCallback,
  createUrlSearchParams,
} from '@/shared/lib/use-url-search-params/use-url-search-params';
import { z } from 'zod';

const zodSchema = z
  .object({
    page: z.string().default('1'),
    years: z.array(z.string()).optional(),
    search: z.string().optional(),
  })
  .strict();

type Schema = z.infer<typeof zodSchema>;

const beforeUpdateCallback: BeforeUpdateCallback<Schema> = (updatedParams) => {
  if (Object.keys(updatedParams).includes('page')) {
    return updatedParams;
  }

  if (Object.keys(updatedParams).some((key) => ['years'].includes(key))) {
    return {
      page: '1',
      search: undefined,
      ...updatedParams,
    };
  }

  return {
    page: '1',
    ...updatedParams,
  };
};

const {
  URLSearchParamsProvider: BooksFilterProvider,
  useUpdateURLSearchParams: useUpdateBooksFilter,
  useGetURLSearchParams: useGetBooksFilter,
} = createUrlSearchParams<Schema>({
  zodSchema,
  beforeUpdateCallback,
});

export { BooksFilterProvider, useUpdateBooksFilter, useGetBooksFilter };
