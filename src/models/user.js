const pool = require('../db');

class User {
  static async register(firstName, lastName, levelOfStudy) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'INSERT INTO users (first_name, last_name, level_of_study) VALUES (?, ?, ?)',
        [firstName, lastName, levelOfStudy]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findByPhoneNumber(phoneNumber) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
      return rows[0];
    } finally {
      connection.release();
    }
  }
}

module.exports = User;
