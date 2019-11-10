from config import *
from constants import *

import os
import tweepy as tw
from textblob import TextBlob
import json

# Setting tweepy authentication
auth = tw.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tw.API(auth, wait_on_rate_limit=True)


def get_tweets(geo):
    tweets = tw.Cursor(api.search,
                       geocode=geo,
                       lang="en",
                       tweet_mode='extended',
                       result_type="recent").items(50)
    tweet_data = []

    for tweet in tweets:
        tweet_data.append(tweet)

    return tweet_data


def get_polarity(state_data):

    sentiment_polarity = 0
    pos_tweets = 0
    neg_tweets = 0
    neutral = 0
    for tweet in state_data:
        curr_blob = TextBlob(tweet.full_text)
        polarity = curr_blob.sentiment.polarity
        sentiment_polarity += polarity
        if polarity > 0.3:
            pos_tweets += 1
        elif polarity < -0.3:
            neg_tweets += 1
        else:
            neutral += 1

    return [sentiment_polarity/len(state_data), pos_tweets, neutral, neg_tweets]


def get_polarity_data(state_data):

    data = {}
    for key in state_tweets:
        data[key] = get_polarity(state_tweets[key])

    return data


def get_state_tweets(state_coordinates, state_radius, state_pop_density):

    state_tweets = {}
    for key in state_coordinates:
        geo = str(state_coordinates[key][0]) + "," + \
            str(state_coordinates[key][1]) + "," + \
            str(state_radius[key]/1000) + 'km'

        curr_tweets = get_tweets(geo)
        state_tweets[key] = curr_tweets

    return state_tweets


state_tweets = get_state_tweets(STATE_COORDINATES, RADIUS, POPULATION_DENSITY)
polarity_data = get_polarity_data(state_tweets)

with open('data.txt', 'w') as outfile:
    json.dump(polarity_data, outfile)
