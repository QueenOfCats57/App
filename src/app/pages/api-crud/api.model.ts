// Модель для объекта, который будем хранить на сервере
export interface ApiObject {
  id: string;
  name: string;
  data: {
    year: number;
    price: number;
    CPU_model: string;
    Hard_disk_size: string;
    color?: string;
    description?: string;
    rating?: number;
  };
  createdAt?: string;
}

// Модель для создания нового объекта
export interface CreateApiObject {
  name: string;
  data: {
    year: number;
    price: number;
    CPU_model: string;
    Hard_disk_size: string;
    color?: string;
    description?: string;
    rating?: number;
  };
}

// Модель для обновления объекта
export interface UpdateApiObject {
  name?: string;
  data?: {
    year?: number;
    price?: number;
    CPU_model?: string;
    Hard_disk_size?: string;
    color?: string;
    description?: string;
    rating?: number;
  };
}

// Ответ от API
export interface ApiResponse {
  message?: string;
  data?: ApiObject;
}