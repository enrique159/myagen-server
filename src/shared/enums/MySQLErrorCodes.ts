export enum MySQLErrorCodes {
  DUPLICATE_KEY = 1062, // Violación de clave única
  CANNOT_DELETE_OR_UPDATE = 1451, // Restricción de clave externa
  FOREIGN_KEY_CONSTRAINT_FAILS = 1216, // Fallo al agregar clave foránea
  NO_REFERENCED_ROW = 1217, // Clave foránea referenciada no existe
  SYNTAX_ERROR = 1064, // Error de sintaxis en SQL
  UNKNOWN_COLUMN = 1054, // Columna desconocida en campo/condición
  TABLE_DOESNT_EXIST = 1146, // Tabla no existe
  COLUMN_CANNOT_BE_NULL = 1048, // Columna no puede ser NULL
  ACCESS_DENIED = 1045, // Acceso denegado (usuario/contraseña)
  LOCK_WAIT_TIMEOUT = 1205, // Timeout por espera de bloqueo
  DEADLOCK_FOUND = 1213, // Deadlock detectado
  TOO_MANY_CONNECTIONS = 1040, // Muchas conexiones activas
  OUT_OF_MEMORY = 1037, // Memoria del servidor insuficiente
}
