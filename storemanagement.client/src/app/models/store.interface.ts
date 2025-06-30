export interface Store {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  storeKey: string; // 6-character alphanumeric key
  makerUserId?: string;
  checkerUserId?: string;
  makerUsername?: string;
  checkerUsername?: string;
  users?: StoreUser[]; // All users associated with this store
  createdDate?: Date;
  updatedDate?: Date;
  isActive?: boolean;
}

export interface CreateStoreRequest {
  name: string;
  address: string;
  email: string;
  phone: string;
  storeKey: string;
}

export interface StoreUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'maker' | 'checker';
  storeId: string;
  storeKey: string;
  isActive: boolean;
  createdDate: Date;
  lastLoginDate?: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'maker' | 'checker';
  password: string;
  storeId: string;
}

export interface ChangePasswordRequest {
  userId: string;
  newPassword: string;
}

export interface StoreResponse {
  success: boolean;
  message: string;
  store?: Store;
  stores?: Store[];
  users?: StoreUser[];
  makerUser?: StoreUser;
  checkerUser?: StoreUser;
}
