export interface Server {
  id: string;
  name: string;
  url: string;
  port: string;
  username: string;
  password: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServerDTO {
  name: string;
  url: string;
  port: string;
  username: string;
  password: string;
}

export interface UpdateServerDTO {
  name?: string;
  url?: string;
  port?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
}

export interface ServerRepository {
  create(data: CreateServerDTO): Promise<Server>;
  findAll(): Promise<Server[]>;
  findById(id: string): Promise<Server | null>;
  findActive(): Promise<Server | null>;
  update(id: string, data: UpdateServerDTO): Promise<Server>;
  delete(id: string): Promise<void>;
  setActive(id: string): Promise<Server>;
}
