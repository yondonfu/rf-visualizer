from flask import Flask, render_template
import visualize_rf

app = Flask(__name__)

@app.route('/')
def index():
  # with open('static/data/tree.json', 'rb') as readfile:
  #   print readfile.read()

  return render_template('index.html')

if __name__ == '__main__':
  app.run()