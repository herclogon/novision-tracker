import peewee
import pathlib
import json

from playhouse.shortcuts import model_to_dict, dict_to_model


SCRIPT_DIR = pathlib.Path().absolute()

# SQLite database using WAL journal mode and 64MB cache.
sqlite_db = peewee.SqliteDatabase(
    SCRIPT_DIR / "db.sqlite", pragmas={"journal_mode": "wal", "cache_size": -1024 * 64}
)


class BaseModel(peewee.Model):
    """A base model that will use our Sqlite database."""

    class Meta:
        database = sqlite_db


class Audio(BaseModel):
    pass


class Route(BaseModel):
    description = peewee.TextField(null = True)


class Mark(BaseModel):
    latitude = peewee.DoubleField()
    longitude = peewee.DoubleField()
    audio = peewee.ForeignKeyField(Audio)
    route = peewee.ForeignKeyField(Route, null = True)


# Run "migrations".
sqlite_db.connect()
sqlite_db.create_tables([Mark, Audio, Route])

def selectToJSON(select):
    return json.dumps([model_to_dict(model) for model in select])