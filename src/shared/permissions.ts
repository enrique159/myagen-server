// List of permissions
export enum PERMISSIONS {
  WITHOUT_PERMISSIONS = 0, // No permisos
  READ_REGISTERS = 1, // Leer registros
  READ_ALL_REGISTERS = 2, // Leer todos los registros
  CREATE_REGISTERS = 4, // Crear registros
  UPDATE_REGISTERS = 8, // Actualizar registros
  UPDATE_ALL_REGISTERS = 16, // Actualizar todos los registros
  DELETE_REGISTERS = 32, // Eliminar registros
  DELETE_ALL_REGISTERS = 64, // Eliminar todos los registros
  READ_SPOKESPERSONS = 128, // Leer representantes
  READ_ALL_SPOKESPERSONS = 256, // Leer todos los representantes
  CREATE_SPOKESPERSONS = 512, // Crear representantes
  UPDATE_SPOKESPERSONS = 1024, // Actualizar representantes
  UPDATE_ALL_SPOKESPERSONS = 2048, // Actualizar todos los representantes
  DELETE_SPOKESPERSONS = 4096, // Eliminar representantes
  DELETE_ALL_SPOKESPERSONS = 8192, // Eliminar todos los representantes
  READ_REPORTS = 16384, // Leer reportes
  EXPORT_REPORTS = 32768, // Exportar reportes
  READ_USERS = 65536, // Leer usuarios
  CREATE_USERS = 131072, // Crear usuarios
  UPDATE_USERS = 262144, // Actualizar usuarios
  DELETE_USERS = 524288, // Eliminar usuarios
  READ_LOCATIONS = 1048576, // Leer ubicaciones
}

export const checkPermission = (permission, mask) => (permission & mask) > 0;

export default {
  PERMISSIONS,
  checkPermission,
};
