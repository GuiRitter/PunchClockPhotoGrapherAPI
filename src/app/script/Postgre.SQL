-- sudo -u postgres createdb punch_clock_photo_grapher

-- psql punch_clock_photo_grapher

create table ´user´ (
	login text primary key,
	password text not null
);

create table photo ( 
	date_time text primary key, 
	data_uri text not null 
);

-- DROP TRIGGER data_uri_format ON photo; DROP FUNCTION test_data_uri_format;
CREATE FUNCTION test_data_uri_format() RETURNS trigger AS $$
DECLARE
	matches boolean;
BEGIN
		SELECT NEW.data_uri SIMILAR TO 'data:image/png;base64,%' INTO matches;
	IF matches THEN
		RETURN NEW;
	END IF;
	RAISE EXCEPTION 'Data URI must start with data:image/png;base64,';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER data_uri_format BEFORE INSERT OR UPDATE ON photo
FOR EACH ROW EXECUTE PROCEDURE test_data_uri_format();

-- DROP TRIGGER photo_date_time_format ON photo; DROP FUNCTION test_photo_date_time_format;
CREATE FUNCTION test_photo_date_time_format() RETURNS trigger AS $$
DECLARE
	matches boolean;
BEGIN
	SELECT new.date_time SIMILAR TO '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3,6}(Z|((\+|-)([0-9]{2}:[0-9]{2})))' INTO matches;
	IF matches THEN
		RETURN NEW;
	END IF;
	RAISE EXCEPTION 'Photo date/time must be formatted according to ISO 8601.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER photo_date_time_format BEFORE INSERT OR UPDATE ON photo
FOR EACH ROW EXECUTE PROCEDURE test_photo_date_time_format();
