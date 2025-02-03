# use-url-search-params Hook Documentation

## Overview

The `use-url-search-params` hook provides an easy way to synchronize URL search parameters with your application's state using Zod validation. It exposes a context provider and two hooks:

- `useGetURLSearchParams`: for reading current search parameters.
- `useUpdateURLSearchParams`: for updating search parameters.

## Setup

Initialize the hook by calling `createUrlSearchParams` with a Zod schema and optional callbacks:

```tsx
import { z } from 'zod';
import { createUrlSearchParams } from 'path/to/use-url-search-params';

const schema = z.object({
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  page: z.string().default('1'),
  state: z.enum(['draft', 'active', 'done']).default('draft'),
});

const {
  URLSearchParamsProvider,
  useGetURLSearchParams,
  useUpdateURLSearchParams,
} = createUrlSearchParams({
  zodSchema: schema,
  beforeUpdateCallback: (updated, current) => ({ ...updated }),
  onValidationError: (error) => console.error(error),
});
```

Wrap your application with the `URLSearchParamsProvider` to enable the hook:

```tsx
function App() {
  return (
    <URLSearchParamsProvider>
      {/* ...your components... */}
    </URLSearchParamsProvider>
  );
}
```

## API

### URLSearchParamsProvider

- Context provider that initializes and syncs the URL search parameters with default values (if provided via Zod).

### useGetURLSearchParams

- Returns the current URL parameters that have been parsed and validated against the provided Zod schema.

### useUpdateURLSearchParams

- Returns a function to update the URL search parameters.
- Accepts an object with the parameters to update and an optional object for navigation options.
- Automatically cleans up empty parameter values.
- Invokes `beforeUpdateCallback` to allow pre-processing of values before updating.

## Example

```tsx
import React from 'react';
import { useGetURLSearchParams, useUpdateURLSearchParams } from 'path/to/use-url-search-params';

export function BooksPage() {
  const params = useGetURLSearchParams();
  const updateParams = useUpdateURLSearchParams();

  const handleFilterChange = (newFilter: string) => {
    updateParams({ search: newFilter });
  };

  return (
    <div>
      <input
        type="text"
        value={params.search ?? ''}
        onChange={(e) => handleFilterChange(e.target.value)}
      />
      {/* ...rest of your UI... */}
    </div>
  );
}
```

## Under the Hood

- **Decoding**: Parameters from the URL are decoded and validated using the provided Zod schema.
- **Encoding**: Updated parameters are re-encoded and validated before being applied to the URL.
- **Callbacks**:
  - `beforeUpdateCallback`: Modify parameters before updating.
  - `onValidationError`: Handle any validation errors from Zod.

## Conclusion

This hook allows your React application to easily manage URL search parameters with robust validation and default handling. For further customization, consider extending the provided callback functions.
