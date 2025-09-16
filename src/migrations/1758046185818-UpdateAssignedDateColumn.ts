import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAssignedDateColumn1758046185818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Paso 1: Modificar la columna de date a datetime
    await queryRunner.query(`
      ALTER TABLE elements 
      MODIFY COLUMN assigned_date datetime NOT NULL
    `);
    
    // Paso 2: Actualizar todas las fechas al día de hoy a las 12:00 PM
    await queryRunner.query(`
      UPDATE elements 
      SET assigned_date = CONCAT(CURRENT_DATE(), ' 12:00:00')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir a tipo date
    await queryRunner.query(`
      ALTER TABLE elements 
      MODIFY COLUMN assigned_date date NOT NULL
    `);
  }
}
