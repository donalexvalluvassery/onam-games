from flask import Flask, jsonify
from flask import request, Response
from os import environ
import crossword
import redis
from copy import deepcopy
# Remove this
from random import randrange

REDIS_HOST = environ.get("REDIS_HOST", "0.0.0.0")
r = redis.StrictRedis(host=REDIS_HOST, port="6379")

app = Flask(__name__)

@app.route('/')
@cross_origin()
def hello_world():
    """Print 'Hello, world!' as the response body."""
    return "Hello World!"

@app.route('/getcrossword', methods=['GET'])
@cross_origin()
def getCrossword():
    result = deepcopy(crossword.crossword_data)
    for d in result["data"]:
        d["answer"] = "*" * len(d["answer"])
    return jsonify(result)

@app.route('/validatecrosswordentry', methods=['POST'])
@cross_origin()
def validateCrosswordEntry():
    request_data=request.get_json(force=True)
    result = crossword.crossword_data
    result = {"match": result["data"][int(request_data["key"])]["answer"] == request_data["value"]}
    return jsonify(result)

@app.route('/getboatpositions', methods=['GET'])
@cross_origin()
def getBoatPositions():
    pos = [r.get("BR:team1"), r.get("BR:team2"),r.get("BR:team3"), r.get("BR:team4")]
    for i in range(0, len(pos)):
        pos[i] = float(pos[i].decode('utf-8')) if pos[i] is not None else 0
    # Add team positions to this
    result = {"positions": pos}
    # Remove these once properly updated. Added temporarily to show boat movement
    update = [randrange(10), randrange(10), randrange(10), randrange(10)]
    for i,p in enumerate(pos):
        r.set("BR:team"+str(i+1), str(min(p+update[i], 100)))
    return jsonify(result)


@app.route('/refreshboatpositions', methods=['GET'])
@cross_origin()
def refreshBoatPositions():
    r.set("BR:team1", "0")
    r.set("BR:team2", "0")
    r.set("BR:team3", "0")
    r.set("BR:team4", "0")

