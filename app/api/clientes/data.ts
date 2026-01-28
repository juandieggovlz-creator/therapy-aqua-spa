// Base de datos de clientes
export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  totalReservas: number;
  ultimaReserva?: string;
  notas?: string;
}

export const CLIENTES: Cliente[] = [];










