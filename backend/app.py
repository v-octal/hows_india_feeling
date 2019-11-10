from flask import Flask, jsonify, request
from flask_restful import Resource, Api
import json

app = Flask(__name__)
api = Api(app)


class SentimentData(Resource):

    def get(self):

        read_data = None

        with open('data.json') as json_file:
            read_data = json.load(json_file)

        return read_data


api.add_resource(SentimentData, '/')


if __name__ == '__main__':

    app.run(debug=True)
