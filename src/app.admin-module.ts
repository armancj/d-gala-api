import { PrismaService } from './prisma/prisma.service';
import { INestApplication, ModuleMetadata } from '@nestjs/common';

export async function importAdminModule(app: INestApplication) {
  const { AdminModule, AdminResourceModule,  } = await import('@adminjs/nestjs');
  const { Database, Resource, getModelByName } = await import(
    '@adminjs/prisma'
  );
  const { AdminJS } = await import('adminjs');

  AdminJS.registerAdapter({
    Database,
    Resource,
  });

  AdminResourceModule.
  const adminJsOptions = {
    rootPath: '/admin',
    branding: {
      companyName: 'De Gala',
    },
    resources: [
      {
        resource: {
          model: getModelByName('Post'),
          client: app.get(PrismaService),
        },
        options: {},
      },
      {
        resource: {
          model: getModelByName('User'),
          client: app.get(PrismaService),
        },
        options: { translations: 'es' },
      },
    ],
    dashboard: { handler: '/api/rest/v1' } as any,
  };

  return AdminModule.createAdminAsync({
    useFactory: (prisma: PrismaService) => ({
      adminJsOptions,
      rootPath: '/admin',
      resources: [
        {
          resource: { model: getModelByName('Post'), client: prisma },
          options: {},
        },
        {
          resource: { model: getModelByName('User'), client: prisma },
          options: { translations: 'es' },
        },
      ],
      dashboard: { handler: '/api/rest/v1' },
    }),
  });
}
