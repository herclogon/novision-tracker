from aiohttp import web
import json
import io

import db_mapper
import pathlib

SCRIPT_DIR = pathlib.Path().absolute()
AUDIO_DIR = SCRIPT_DIR / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


async def onMarkAdd(request):
    print(request)

    post = await request.post()
    position = json.loads(post["position"])
    print(post["audio"])
    print(json.loads(post["position"]))

    audio = db_mapper.Audio()
    audio.save()

    mark = db_mapper.Mark()
    mark.audio = audio
    mark.latitude = position["latitude"]
    mark.longitude = position["longitude"]
    mark.save()

    with open(AUDIO_DIR / f"{audio.id}.wav", "wb", buffering=0) as f:
        f.write(post["audio"].file.read())

    # audio = request.match_info.get("audio", "Anonymous")
    text = "Hello, audio"
    # print(audio)
    return web.Response(
        text=text,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "plain/text; charset=utf-8",
        },
    )


async def onMarkListGet(request):
    print(request)
    marks = db_mapper.Mark.select()
    return web.Response(
        text=db_mapper.selectToJSON(marks),
        # content_type="application/json",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; charset=utf-8",
        },
    )


async def onMarkDelete(request):
    request_data = await request.json()

    query = db_mapper.Mark.delete().where(db_mapper.Mark.id == request_data["mark_id"])
    query.execute()

    return web.Response(
        text=json.dumps(None),
        headers={
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "plain/text; charset=utf-8",
        },
    )


app = web.Application()
app.add_routes(
    [
        web.post("/mark/save", onMarkAdd),
        web.post("/mark/delete", onMarkDelete),
        web.get("/mark/list", onMarkListGet),
        web.static("/", SCRIPT_DIR),
    ]
)

if __name__ == "__main__":
    web.run_app(app)