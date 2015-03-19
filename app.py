from flask import Flask, render_template, jsonify
import visualize_rf

app = Flask(__name__)

@app.route('/')
def index():

  return render_template('index.html')

@app.route('/train')
def train():

  visualize_rf.get_rf()

  return jsonify(result=True)

@app.route('/predict')
def predict():

  pred = visualize_rf.get_rf_prediction()

  return jsonify(result=pred)

if __name__ == '__main__':
  app.run()