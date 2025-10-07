// Centralised definitions for default roles, permissions, and enumerated status values.
export const DEFAULT_ROLES = [
  {
    name: 'Admin',
    description: 'Administrator with full platform access.',
  },
  {
    name: 'Trainer',
    description: 'Trainer responsible for managing learning materials.',
  },
  {
    name: 'Employee',
    description: 'Employee with course consumption capabilities.',
  },
];

export const CRUD_ACTIONS = ['create', 'read', 'update', 'delete'] as const;
export type CrudAction = (typeof CRUD_ACTIONS)[number];

export const DEFAULT_PERMISSION_MODULES = [
  'users',
  'roles',
  'courses',
  'permissions',
  'masters',
  'submasters',
  'employee-permissions',
] as const;
export type PermissionModule = (typeof DEFAULT_PERMISSION_MODULES)[number];

export interface DefaultPermissionDefinition {
  module: PermissionModule;
  action: CrudAction;
}

export const DEFAULT_PERMISSIONS: DefaultPermissionDefinition[] = DEFAULT_PERMISSION_MODULES.flatMap((module) =>
  CRUD_ACTIONS.map((action) => ({ module, action }))
);

export const ROLE_PERMISSION_MAP: Record<string, DefaultPermissionDefinition[]> = {
  Admin: DEFAULT_PERMISSIONS,
  Trainer: [
    { module: 'courses', action: 'create' },
    { module: 'courses', action: 'read' },
    { module: 'courses', action: 'update' },
    { module: 'users', action: 'read' },
  ],
  Employee: [
    { module: 'courses', action: 'read' },
  ],
};

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
