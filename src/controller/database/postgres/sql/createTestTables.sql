CREATE SCHEMA test;

CREATE TABLE test.sensors (
  "id" integer generated always as identity primary key,
  "name" character varying(40) not null unique,
  "type" character varying(40) not null,
  "isrunning" boolean default true
);

CREATE TABLE test.actuators (
  "id" integer generated always as identity primary key,
  "name" character varying(40) not null unique,
  "type" character varying(40) not null,
  "isrunning" boolean default true
);

CREATE TABLE test.sensordata (
  "id" integer not null references test.sensors(id),
  "value" double precision not null,
  "timestamp" timestamp not null
);

CREATE TABLE test.actuatorcommand (
  "id" integer not null references test.actuator(id),
  "timestamp" timestamp not null,
  "command" character varying(1024) not null,
  "resolved" boolean default false
);

CREATE TABLE test.logs (
  "id" integer generated always as identity primary key,
  "sensorname" character varying(40) references test.sensors(name) default null,
  "actuatorname" character varying(40) references test.actuators(name) default null,
  "logcontent" text not null
);

CREATE TABLE test.users (
  "email" character varying(255) not null unique primary key,
  "password" character varying(64) not null,
  "apikeyhash" character varying(64) not null
);