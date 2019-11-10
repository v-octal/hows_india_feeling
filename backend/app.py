from flask import Flask, jsonify, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)


class SentimentData(Resource):

    def get(self):

        return jsonify({'message': 'ok'})


api.add_resource(SentimentData, '/')


if __name__ == '__main__':

    app.run(debug=True)
