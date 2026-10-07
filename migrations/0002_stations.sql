create table if not exists stations (
  id text primary key,
  name text not null,
  short_name text not null,
  city text not null,
  localidad text not null default '',
  address text not null,
  lat double precision not null,
  lng double precision not null,
  kind text not null,
  image text not null,
  score double precision not null,
  scores_json text not null,
  equipment_json text not null,
  lighting text not null,
  surface text not null,
  crowd text not null,
  hours text not null,
  transmilenio_json text not null,
  best_for_json text not null,
  level text not null,
  safety text not null,
  summary text not null,
  tips_json text not null,
  source text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists stations_city_idx on stations (city);
create index if not exists stations_score_idx on stations (score desc);
