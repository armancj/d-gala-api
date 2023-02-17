import { Category } from '@prisma/client';

export const CategoryData = [
  {
    name: 'woman',
    generalCategory: true,
  },
  {
    name: 'man',
    generalCategory: true,
  },
  {
    name: 'unisex',
    generalCategory: true,
  },
  {
    name: 'shoes',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'leather bag',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'leather briefcase',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'leather bracelet',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'leather folder',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'leather belt',
    generalCategory: false,
    parentId: 1,
  },
  {
    name: 'shoes',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'leather bag',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'leather briefcase',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'leather bracelet',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'leather folder',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'leather belt',
    generalCategory: false,
    parentId: 2,
  },
  {
    name: 'shoes',
    generalCategory: false,
    parentId: 3,
  },
  {
    name: 'leather bag',
    generalCategory: false,
    parentId: 3,
  },
  {
    name: 'leather briefcase',
    generalCategory: false,
    parentId: 3,
  },
  {
    name: 'leather bracelet',
    generalCategory: false,
    parentId: 3,
  },
  {
    name: 'leather folder',
    generalCategory: false,
    parentId: 3,
  },
  {
    name: 'leather belt',
    generalCategory: false,
    parentId: 3,
  },
];
