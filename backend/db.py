import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="1213"
    )

def get_drug_info(drug_name):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM drugs WHERE name = %s", (drug_name,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return {
            "id": row[0],
            "name": row[1],
            "ingredient": row[2],
            "function": row[3],
            "dosage": row[4],
            "side_effects": row[5],
            "manufacturer": row[6]
        }
    return None
