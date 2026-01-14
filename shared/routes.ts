import { z } from 'zod';
import { insertUserSchema, insertPredictionSchema, setRaceResultsSchema, drivers, races, predictions, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    getProfile: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect & { predictions: (typeof predictions.$inferSelect & { race: typeof races.$inferSelect })[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  drivers: {
    list: {
      method: 'GET' as const,
      path: '/api/drivers',
      responses: {
        200: z.array(z.custom<typeof drivers.$inferSelect>()),
      },
    },
  },
  races: {
    list: {
      method: 'GET' as const,
      path: '/api/races',
      responses: {
        200: z.array(z.custom<typeof races.$inferSelect & { p1Driver?: typeof drivers.$inferSelect | null, p2Driver?: typeof drivers.$inferSelect | null, p3Driver?: typeof drivers.$inferSelect | null }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/races/:id',
      responses: {
        200: z.custom<typeof races.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    setResults: {
      method: 'POST' as const,
      path: '/api/races/:id/results',
      input: setRaceResultsSchema,
      responses: {
        200: z.custom<typeof races.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  predictions: {
    create: {
      method: 'POST' as const,
      path: '/api/predictions',
      input: insertPredictionSchema,
      responses: {
        201: z.custom<typeof predictions.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    listMine: {
      method: 'GET' as const,
      path: '/api/predictions/mine',
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect & { race: typeof races.$inferSelect }>()),
      },
    },
  },
  leaderboard: {
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard',
      responses: {
        200: z.array(z.object({
          userId: z.number(),
          username: z.string(),
          color: z.string(),
          totalPoints: z.number(),
          exactMatches: z.number(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
