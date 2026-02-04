"""
Database migration script to add flaw_report column to history table.
Run this script to update your existing database schema.
"""
from config import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        # Add flaw_report column to history table
        conn.execute(text("""
            ALTER TABLE history 
            ADD COLUMN IF NOT EXISTS flaw_report TEXT;
        """))
        conn.commit()
        print("✓ Migration complete: Added flaw_report column to history table")

if __name__ == "__main__":
    migrate()
