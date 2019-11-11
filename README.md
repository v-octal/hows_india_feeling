# How's India Feeling?
An application which displays India's region wise twitter sentiment on the map.

![Site screenshot](https://user-images.githubusercontent.com/19239291/68602863-26900180-04cd-11ea-8282-08f9caa7277b.png)

## How to run?
### Clone 
1. `git clone https://github.com/geekyJock8/hows_india_feeling.git`
### Configurations
1. In the *backend* folder create a new file `config.py`
2. In `config.py` paste the following code with your twitter api credentials:
    
    ```
    consumer_key = 'YOUR KEY'
    consumer_secret = 'YOUR SECRECT'
    access_token = 'YOUR TOKEN'
    access_token_secret = 'YOUR TOKEN SECRET'
    ```
### Latest data
1. cd into *backend*
2. Run `python3 tweet_handler.py`

This will fetch the latest data from Twitter API. `tweet_handler.py` contains the logic of fetching tweets.

### Run Server
1. Inside *backend* run `python app.py`

Note down the url of your local server

### Set API Endpoint
1. In root directory, in `index.js`:

   Set `api_url = 'YOUR LOCAL SERVER'`
   
   (It's most likely going to be at `http://127.0.0.1:5000/`)

### Run
1. Open `index.html` in a browser

## Tweet Fetching

The idea was to show the sentiment of each particular area. So, far it only fetches tweets state wise.

Since Twitter doesn't allow a geometry parameter to filter tweets, we are using points and radius filter of twitter api.
The mapping is stored in [constants.py](https://github.com/geekyJock8/hows_india_feeling/blob/master/backend/constants.py)
### Twitter limit
Since there's a limit on the number of tweets we can fetch, only a few number of tweets are fetched per 15 minutes. The [tweet_handler.py](https://github.com/geekyJock8/hows_india_feeling/blob/master/backend/tweet_handler.py) is required to added as cron job which is to be run every 15 minutes. 

Also, the number of tweets fetched per state is not same, rather's proportional to the state's population density.
### Mapping Visualized
![State Mapping](https://github.com/geekyJock8/hows_india_feeling/blob/master/geoJsonData/state_circles.png)

Next step would be to replace this logic with something which is more correct. One possible solution is to fill each area with smaller circles and use these circles. [This](https://stackoverflow.com/questions/6586338/randomly-and-efficiently-filling-space-with-shapes) is a good starting point.

## TODOS
1. Improve UI
2. Improve mapping logic
3. Create Logic for smaller areas
4. Make a better todo list

# 
*Contributions are welcome!*
