CREATE TABLE drug_info (
  item_seq         BIGINT     PRIMARY KEY,
  item_name        TEXT       NOT NULL,
  entp_name        TEXT,
  spclty_pblc      TEXT,
  prduct_type      TEXT,
  big_prdt_img_url TEXT,
  storage_method   TEXT,
  valid_term       TEXT,
  type_name        TEXT,
  updated_at       TIMESTAMP  NOT NULL DEFAULT NOW()
);
