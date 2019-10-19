import subprocess
import datetime

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r'/log*': {'origins': '*'}})

@app.route('/log')
def get_log():
    repo = request.args.get('repo')
    if not repo:
        return '', 400
    name = datetime.datetime.timestamp(datetime.datetime.now())
    subprocess.check_output(['git', 'clone', '--bare', repo, str(name)], shell=False)
    lines = subprocess.check_output(['git', '--git-dir', str(name), 'log', '--pretty=format:user:%aN%n%ct', '--reverse', '--raw', '--encoding=UTF-8', '--no-renames' ], shell=False)
    subprocess.call(['rm', '-rf',str(name)])
    return lines

if __name__ == "__main__":
    app.run(host='0.0.0.0')
