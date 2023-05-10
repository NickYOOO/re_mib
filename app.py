from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://sparta:test@cluster0.isqkcv6.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/re_min', methods=["POST"])
def re_min_post():
    name_receive = request.form['name_give']
    star_receive = request.form['star_give']
    caption_receive = request.form['caption_give']
    img_receive = request.form['img_give']
    password_receive = request.form['password_give']


    doc = {
        'name' : name_receive,
        'star' : star_receive,
        'caption' : caption_receive,
        'img' : img_receive,
        'password' : password_receive
    }

    db.re_min.insert_one(doc)
    return jsonify({'msg':'POST 연결 완료!'})

@app.route('/re_min', methods=["GET"])
def re_min_get():
    all_re_min = list(db.re_min.find({},{'_id':False}))
    return jsonify({'result' : all_re_min})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)