DROP TABLE lida.logs;
DROP TABLE lida.sensorData;
DROP TABLE lida.actuatorCommand;
DROP TABLE lida.users;
DROP TABLE lida.actuators;
DROP TABLE lida.sensors;
DROP SCHEMA lida;

CREATE SCHEMA lida;

CREATE TABLE lida.sensors (
  "id" integer generated always as identity primary key,
  "name" character varying(40) not null unique,
  "type" character varying(40) not null,
  "isrunning" boolean default true
);

CREATE TABLE lida.actuators (
  "id" integer generated always as identity primary key,
  "name" character varying(40) not null unique,
  "type" character varying(40) not null,
  "isrunning" boolean default true
);

CREATE TABLE lida.sensordata (
  "id" integer not null references lida.sensors(id),
  "value" double precision not null,
  "timestamp" timestamp not null
);

CREATE TABLE lida.actuatorcommand (
  "commandid" integer generated always as identity primary key,
  "actuatorid" integer not null references lida.actuators(id),
  "timestamp" timestamp not null,
  "command" character varying(1024) not null,
  "timesperday" smallint not null,
  "resolved" boolean default false
);

CREATE TABLE lida.logs (
  "id" integer generated always as identity primary key,
  "logcontent" text not null,
  "issensorlog" boolean not null,
  "isactuatorlog" boolean not null
);

CREATE TABLE lida.users (
  "email" character varying(255) not null unique primary key,
  "password" character varying(64) not null,
  "apikeyhash" character varying(64) not null
);

INSERT INTO lida.logs(logcontent, issensorlog, isactuatorlog)
VALUES ('', true, false), ('', false, true);

